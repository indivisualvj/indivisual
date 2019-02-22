/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

var messaging = false;
var audio = false; // todo ->audioman.analyser? oder nur noch audioman.volumes etc?
var audioman = false;
var beatkeeper = false;
var animation = false;
var renderer = false;
var displayman = false;
var sourceman = false;
var textureman = false;
var listener = false;
var sm = false;

/**
 *
 */
document.addEventListener('DOMContentLoaded', function () {

    animation = new HC.Animation(G_INSTANCE);
    messaging = new HC.Messaging(animation);

    messaging.connect(function (reconnect) {

        _log(animation.name, 'connected', true, true);

        if (!reconnect) {
            loadResources(setupResources(), function () {

                assetman.loadTextures();
                assetman.loadFonts();

                HC.DisplayController.createAllControls();
                HC.SourceController.createAllControls();

                listener = new HC.Listener();
                audioman = new HC.AudioManager();
                audio = new HC.AudioAnalyser(audioman.audioContext);
                beatkeeper = new HC.Beatkeeper();

                renderer = new HC.Renderer({
                    layers: new Array(statics.ControlValues.layer.length)
                });

                if (IS_ANIMATION) {
                    listener.register('webglcontextlost', animation.name, function () {
                        // now reset...
                        _log('HC.Renderer', 'another context loss...', true, true);

                        if (DEBUG) {
                            for (var i in MIDI_ROW_ONE) { // glContext messed up... make that clear
                                messaging.emitMidi('glow', MIDI_ROW_ONE[i], {timeout: 500, times: 15});
                                messaging.emitMidi('glow', MIDI_ROW_TWO[i], {timeout: 500, times: 15});
                            }

                        } else {
                            window.location.reload(true);
                        }
                    });
                }

                sm = new HC.SettingsManager(statics.AnimationSettings, renderer.layers);

                displayman = new HC.DisplayManager({
                    display: new Array(statics.DisplayValues.display.length)
                });
                displayman.resize(renderer.getResolution());

                sourceman = new HC.SourceManager({
                    sequence: new Array(statics.SourceValues.sequence.length),
                    sample: new Array(statics.SourceValues.sample.length),
                    video: new Array(statics.DisplayValues.video.length)
                });
                sourceman.resize(renderer.getResolution());

                textureman = new HC.TextureManager();

                animation.initKeyboard();
                animation.initEvents();

                animation._perspectiveHook = function () {
                    sourceman.renderPerspectives();
                };

                var callback = function (data) {
                    animation.loadSession(data);

                    if (IS_MONITOR) {
                        animation.prepareMonitor();
                    } else {
                        animation.prepareAnimation();
                    }
                };
                messaging.sync(callback);
            });
        }
    });
});

(function () {

    /**
     *
     * @param name
     * @constructor
     */
    HC.Animation = function (name) {
        this.name = name;
        this.now = HC.now();
        this.last = this.now;
        this.running = false;
        this.offline = false;
        this.powersave = false;
        this.doNotDisplay = false; // render displays only every second frame if FPS is set to 60
        this.diff = 0;
        this.duration = 1000 / 60;
        this.lastUpdate = 0;
        this.ms = 0;
        this.rms = 0;
        this._rmsc = 0;
        this._rmss = 0;
        this.fps = 0;
        this.stats = false;

        try {
            this.stats = new Stats();
            this.stats.setMode(0);
        } catch (ex) {
            if (IS_ANIMATION) {
                console.log(ex);
            }
        }
    };

    HC.Animation.prototype = {

        animate: function () {

            /**
             * do general stuff
             */
            var speed = beatkeeper.getDefaultSpeed();

            if (speed.prc == 0) {
                if (IS_ANIMATION) {

                    var detectedSpeed = false;

                    if (audioman.isActive()) {

                        if (statics.ControlSettings.peak_bpm_detect && audio.peakReliable) {

                            detectedSpeed = beatkeeper.speedByPeakBpm(audio.firstPeak, audio.peakBPM, statics.ControlSettings.tempo);

                            if (detectedSpeed) {
                                audio.peakReliable = false;
                                messaging.emitLog('peakBPM', detectedSpeed);
                                animation.updateControl('tempo', detectedSpeed, true, true);
                            }
                        }

                        this.autoVolume();
                    }

                    this.postStatus(detectedSpeed);
                }
            }

            if (audioman.isActive()) {
                var config = {
                    useWaveform: renderer.currentLayer.settings.audio_usewaveform,
                    volume: statics.ControlSettings.volume,
                    resetPeakCountAfter: statics.ControlSettings.shuffle_switch_every,
                    tempo: statics.ControlSettings.tempo,
                    minDiff: beatkeeper.getSpeed('sixteen').duration,
                    now: this.now,
                    thickness: renderer.currentLayer.settings.audio_thickness
                };
                audio.update(config);

                if (audio.peak) {
                    messaging.emitMidi('glow', MIDI_PEAK_FEEDBACK, {timeout: 125});

                    listener.fireAll('AudioAnalyser.peak');
                }

            } else {
                this.updatePeakCount();
            }

            /**
             * END do general stuff
             */

            /**
             * do layer stuff
             */
            if (IS_ANIMATION) {
                this.doShuffle();
            }
            renderer.switchLayer(IS_MONITOR);

            var hook = this.doNotDisplay ? false : this._perspectiveHook;
            renderer.animateLayer(renderer.currentLayer, hook);

        },

        /**
         *
         */
        render: function () {

            sourceman.render(this.doNotDisplay);
            if (!this.doNotDisplay) {
                displayman.render();
            }
        },

        /**
         *
         */
        updatePlay: function () {
            if (IS_MONITOR) {
                statics.ControlSettings.play = statics.ControlSettings.monitor;
            }

            if (statics.ControlSettings.play) {
                this.play();

            } else {
                this.pause();
            }

            if (statics.ControlSettings.play) {
                sourceman.startVideos();

            } else {
                sourceman.stopVideos();
            }
        },

        /**
         *
         */
        play: function () {
            if (this.running) return;
            this.running = true;

            if (this.lastUpdate) {
                this.lastUpdate = HC.now() - this.lastUpdate;
            }
            beatkeeper.play();
            renderer.resumeLayers();

            var inst = this;

            var render = function () {
                if (inst.running) {
                    if (inst.stats) {
                        inst.stats.begin();
                    }
                    inst.updateRuntime();

                    beatkeeper.updateSpeeds(inst.diff, statics.ControlSettings.tempo);

                    if (beatkeeper.getSpeed('sixteen').prc == 0) {
                        inst.doNotDisplay = false;

                    } else if (statics.DisplaySettings.fps < 46) {
                        inst.doNotDisplay = false;

                    } else {
                        inst.doNotDisplay = !inst.doNotDisplay;
                    }

                    inst.animate();
                    inst.render();

                    inst.ms = HC.now() - inst.lastUpdate - inst.last; // time spent on animating and rendering

                    if (statics.DisplaySettings.fps < 60) {
                        setTimeout(function () {
                            requestAnimationFrame(render);
                        }, inst.duration - inst.ms); // substract spent time from timeout

                    } else {
                        requestAnimationFrame(render);
                    }

                    if (inst.stats) {
                        inst.stats.end();
                        inst.fps = inst.stats.values().fps;
                    }

                } else {
                    renderer.pauseLayers();
                    beatkeeper.stop();
                }
            };

            requestAnimationFrame(render);
        },

        /**
         *
         */
        pause: function () {
            this.running = false;
            this.lastUpdate = HC.now();
        },

        /**
         *
         */
        updateRuntime: function () {
            this.now = HC.now() - this.lastUpdate;
            this.diff = this.now - this.last;
            this.diffPrc = this.diff / (1000 / 60);
            this.rms = this.duration - this.ms;
            this._rmsc++;
            this._rmss += this.rms;
            this.last = this.now;

            listener.fireAll('animation.updateRuntime', (animation.now - beatkeeper.beatStartTime) / (60000 / statics.ControlSettings.tempo));
        },

        /**
         *
         */
        updatePeakCount: function () {
            var speed = beatkeeper.getSpeed('half');
            audio.volume = (HC.Osci.sinus(speed.prc) / 2 + 0.5) / 2;

            if (speed.progress <= 0) {
                audio.peak = true;
                audio.peakCount += speed.beats;

                if (audio.peakCount > statics.ControlSettings.shuffle_switch_every) { // doubled due to audio off
                    audio.peakCount = 0;
                }

            } else {
                audio.peak = false;
            }
        },

        /**
         *
         */
        autoVolume: function () {
            var gain = 0;
            if (audio.avgVolume < 0.10) {
                gain += 0.1;

            } else if (audio.avgVolume < 0.20) {
                gain += 0.05;

            } else if (audio.avgVolume < 0.26) {
                gain += 0.005;

            } else if (audio.avgVolume > 0.46) {
                gain -= 0.1;

            } else if (audio.avgVolume > 0.36) {
                gain -= 0.05;

            } else if (audio.avgVolume > 0.30) {
                gain -= 0.005;
            }

            if (gain !== 0) {
                //console.log('gain', [audio.volume, audio.avgVolume, gain]);
                var vo = Math.min(2, Math.max(0.5, statics.ControlSettings.volume + gain));
                animation.updateControl('volume', vo, false, true, false);
            }
        },

        /**
         *
         * @param multiplier
         * @returns {number}
         */
        threadTimeout: function (multiplier) {
            var diff = Math.max(0, 60 - this.fps);
            var ms = 1000 / this.fps;
            return ms * multiplier + ms * diff * multiplier;
        },

        /**
         *
         * @returns {number}
         */
        rmsAverage: function () {
            var rmsa = this._rmss / this._rmsc;
            this._rmss = this._rmsc = 0;

            return rmsa.toFixed(1);
        },

        /**
         *
         * @param detectedSpeed
         */
        postStatus: function (detectedSpeed) {

            var color = detectedSpeed ? 'green' : (audio.peakReliable ? 'yellow' : 'red');
            messaging.emitAttr('#sync', 'data-color', color);

            if (statics.ControlSettings.beat) {
                var speed = beatkeeper.getDefaultSpeed();
                var btk = ['bpm:' + beatkeeper.bpm,
                    'b:' + speed.beats,
                    'd:' + speed.duration.toFixed(0),
                    'p:' + beatkeeper.speeds.quarter.pitch.toFixed(0)
                ];

                messaging.emitAttr('#beat', 'data-label', btk.join(' / '));

                var vo = round(audio.avgVolume, 2) + '';
                messaging.emitAttr('#audio', 'data-mnemonic', vo);

                if (audioman.isActive()) {
                    var au = [
                        audio.peakBPM.toFixed(2),
                    ];
                    messaging.emitAttr('#audio', 'data-label', au.join(' / '));
                }
                //messaging.emitAttr('#beat', 'data-color', 'red', 'green');<
                messaging.emitMidi('glow', MIDI_BEAT_FEEDBACK, {timeout: 125});
                if (detectedSpeed) {
                    messaging.emitMidi('glow', MIDI_PEAKBPM_FEEDBACK, {timeout: 15000 / detectedSpeed, times: 8});
                }
                if (statics.DisplaySettings.display_speed == 'midi') {
                    messaging.emitMidi('clock', MIDI_CLOCK_NEXT, {duration: beatkeeper.getDefaultSpeed().duration});
                }

                if (beatkeeper.getSpeed('half').prc == 0) {
                    for (var i = 0; i < statics.SourceValues.sequence.length; i++) {
                        var parent = getSequenceHasParent(i);
                        var use = getSampleBySequence(i);
                        if (parent) {
                            messaging.emitMidi('glow', MIDI_ROW_TWO[i], {timeout: 125});
                        }
                        if (use != 'off') {
                            messaging.emitMidi('glow', MIDI_ROW_ONE[use], {timeout: 125});
                        }
                    }
                }
            }

            var sh = statics.ControlSettings.shuffle;
            var count = statics.ControlSettings.shuffle_usepeak ? audio.peakCount :
                (statics.shuffle.beats.counter % Math.abs(statics.ControlSettings.shuffle_switch_every));
            messaging.emitAttr('#layer', 'data-label', count + (sh ? 's' : ''));

            var layerDisplayValue = (statics.ControlSettings.layer + 1);
            messaging.emitAttr('#layers', 'data-mnemonic', layerDisplayValue);

            if (animation.stats) {
                var state = (animation.powersave ? 'i' : '') + (animation.offline ? 'o' : '');
                var vals = [
                    'fps:' + animation.fps + state,
                    'rms:' + animation.rmsAverage()];
                messaging.emitAttr('#play', 'data-label', vals.join(' / '));
            }
        },

        /**
         *
         * @param session
         */
        loadSession: function (session) {

            if ('displays' in session) {
                _log('displays', 'synced');
                var displays = session.displays;
                this.updateDisplays(displays, true, false, true);
            }

            if ('sources' in session) {
                _log('sources', 'synced');
                var sources = session.sources;
                this.updateSources(sources, true, false, true);
            }

            if ('settings' in session) {
                _log('settings', 'synced');
                var settings = session.settings;
                for (var k in settings) {
                    this.updateSettings(k, settings[k], true, false, true);
                }
            } else {
                renderer.fullReset(false);
            }

            if ('controls' in session) {
                _log('controls', 'synced');
                var controls = session.controls;
                this.updateControls(controls, true, false, true);
            }

            sourceman.updateSequences();
        },

        /**
         *
         * @param layer
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         */
        updateSetting: function (layer, item, value, display, forward, force) {

            if (statics.AnimationSettings.contains(item)) {

                value = sm.update(layer, item, value);

                var layerIndex = layer;
                layer = renderer.layers[layer];

                switch (item) {

                    // complete layer reset:
                    case 'shape_size':
                    case 'pattern_shapes':
                        renderer.resetLayer(layer);
                        break;

                    // shader reset
                    case 'shaders':
                        layer.updateShaders();
                        break;

                    // case 'audio_smoothing':
                    //     audio.smoothingTimeConstant(layer.settings.audio_smoothing);
                    //     break;

                    case 'lighting_ambient':
                        layer.resetAmbientLight();
                        break;

                    case 'lighting_type':
                    case 'lighting_pattern_lights':
                        layer.resetLighting();
                        break;

                    case 'lighting_fog':
                        layer.resetFog();
                        break;

                    // reload shapes
                    case 'pattern':
                    case 'pattern_mover':
                    case 'shape_modifier':
                    case 'shape_modifier_volume':
                    case 'shape_geometry':
                    case 'shape_transform':
                    case 'mesh_material':
                    case 'material_mapping':
                    // case 'material_uvx':
                    // case 'material_uvy':
                    // case 'material_uvofx':
                    // case 'material_uvofy':
                    // case 'material_map':
                    case 'shape_variant':
                        layer.resetShapes();
                        break;
                }

                switch (item) { // special case for shapetastic
                    case 'shape_vertices':
                        if (display) {
                            layer.resetShapes();
                        }
                }

                if (forward === true) {
                    var data = {};
                    data[item] = value;
                    messaging.emitSettings(layerIndex, data, true, false, force);
                }
            }
        },

        /**
         *
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         * @returns {*}
         */
        updateControl: function (item, value, display, forward, force) {

            if (statics.ControlSettings && statics.ControlSettings.contains(item)) {

                if (item == 'beat') {
                    value = beatkeeper.trigger(value, true, statics.ControlSettings.tempo, true);

                } else if (item == 'session' && value != _HASH) {
                    document.location.hash = value;
                    setTimeout(function () {
                        document.location.reload();
                    }, 250);
                    return;
                }

                value = statics.ControlSettings.update(item, value);

                if (forward === true) {
                    var data = {};
                    data[item] = value;
                    messaging.emitControls(data, true, false, force);
                }

                if (display) {
                    switch (item) {
                        case 'reset':
                            if (renderer) {
                                if (force) {
                                    beatkeeper.reset();
                                    renderer.fullReset(false);
                                    sourceman.resize(renderer.getResolution());
                                    displayman.resize(renderer.getResolution());

                                } else {
                                    renderer.resetLayer(renderer.currentLayer);
                                }
                            }
                            break;

                        case 'layer':
                            audio.peakCount = 0;
                            renderer.nextLayer = renderer.layers[value];
                            break;

                        case 'tempo':
                            sourceman.updateVideos(value);
                            break;

                        case 'monitor':
                            if (!IS_MONITOR) {
                                break;
                            }
                        case 'play':
                            this.updatePlay();
                            break;

                        case 'audio':
                            if (IS_ANIMATION || IS_MONITOR) {
                                audio.reset();
                                if (value) {
                                    audioman.stop();
                                    audioman.initPlugin(value, function (source) {
                                        var analyser = audio.createAnalyser(audioman.context);
                                        source.connect(analyser);
                                        audioman.start();
                                    });

                                } else {
                                    audioman.stop();
                                }
                            }
                            break;

                        case 'shuffle':
                            if (value) {
                                this.shuffleLayer(false);
                            }
                            break;

                    }
                }
            }
        },

        /**
         *
         * @param item
         * @param value
         * @param display means live
         * @param forward
         * @param force
         * @returns {*}
         */
        updateSource: function (item, value, display, forward, force) {

            if (statics.SourceSettings.contains(item)) {

                value = statics.SourceSettings.update(item, value);

                if (forward === true) {
                    var data = {};
                    data[item] = value;
                    messaging.emitSources(data, true, false, force);
                }

                if (display) {
                    var action = false;
                    if (item.match(/^sample\d+_store/) && value) {
                        //var sample =
                        sourceman.storeSample(number_extract(item, 'sample'), value, 1, false);
                        this.updateSource(item, false, false, true, false);

                    } else if (item.match(/^sample\d+_load/) && value) {
                        if (display || IS_MONITOR) {
                            //var sample =
                            sourceman.loadSample(number_extract(item, 'sample'), value);
                        }
                        this.updateSource(item, false, false, true, false);

                    } else if (item.match(/^sample\d+_/)) {
                        sourceman.updateSample(number_extract(item, 'sample'));
                        action = true;

                    } else if (item.match(/^sequence\d+_/)) {
                        sourceman.updateSequence(number_extract(item, 'sequence'));
                        action = true;

                    } else if (item.match(/display\d+_source/)) {
                        var display = displayman.getDisplay(number_extract(item, 'display'));
                        sourceman.updateSource(display);

                        if (display && display.isFixedSize()) {
                            displayman.updateDisplay(display.index, false);
                        }

                        action = true;

                    } else if (item.match(/display\d+_sequence/)) {
                        sourceman.updateSource(displayman.getDisplay(number_extract(item, 'display')));
                        action = true;

                    } else if (item.match(/^lighting_(lights|scale)/)) {
                        displayman.updateDisplays();
                        action = true;

                    } else if (item.match(/^lighting_(mode|color)/)) {
                        sourceman.getLighting(0).update();
                        action = true;
                    }

                    if (action) {
                        animation.offline = false;
                    }
                }
            }
        },

        /**
         *
         * @param data
         */
        updateData: function (data) {

        },

        /**
         *
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         */
        updateDisplay: function (item, value, display, forward, force) {

            if (item.match(/^display\d+_\d/)) { // resize
                if (value) {
                    displayman.centerDisplay(number_extract(item, 'display'), value);
                    this.updateDisplay(item, false, display, true);
                }
                statics.DisplaySettings.update(item, value);

            } else if (statics.DisplaySettings.contains(item)) {

                value = statics.DisplaySettings.update(item, value);

                if (forward === true) {
                    var data = {};
                    data[item] = value;
                    messaging.emitDisplays(data, true, false, force);
                }

                if (display) {
                    switch (item) {
                        case 'fps':
                            this.duration = Math.round(1000 / value);
                            break;

                        case 'resolution':
                            renderer.fullReset(true);
                            sourceman.resize(renderer.getResolution());
                            displayman.resize(renderer.getResolution());
                            break;

                        case 'mapping':
                        case 'clip_context':
                        case 'background':
                            displayman.updateDisplays();
                            break;

                        case 'brightness':
                            displayman.brightness(value);
                            break;

                        case 'display_visibility':
                        case 'border_mode':
                            if (IS_ANIMATION) {
                                statics.display.visibility.random = false;
                                statics.display.border.random = false;
                            }
                            break;
                    }
                }

                if (item.match(/^display\d+_/)) {

                    var i = number_extract(item, 'display');

                    if (item.match(/_mask$/)) { // mask
                        displayman.updateDisplay(i, 'mask');

                    } else if (item.match(/_mapping/)) { // mapping
                        displayman.updateDisplay(i, 'mapping'); // avoid removing/adding maptastic layer

                    } else { // anything else
                        displayman.updateDisplay(i);
                        animation.offline = false;
                    }
                }
            }
        },

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateSettings: function (layer, data, display, forward, force) {

            if (force) {
                for (var k in data) {
                    sm.update(layer, k, data[k]);
                }

                renderer.resetLayer(layer);

            } else {
                for (var k in data) {
                    var value = data[k];
                    this.updateSetting(layer, k, value, display, forward, force);
                }
            }
        },

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateControls: function (data, display, forward, force) {
            for (var k in data) {
                var value = data[k];
                this.updateControl(k, value, display, forward, force);
            }
        },

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateDisplays: function (data, display, forward, force) {

            if (force) {
                for (var k in data) {
                    statics.DisplaySettings.update(k, data[k]);
                }
                renderer.fullReset(true);
                sourceman.resize(renderer.getResolution());
                displayman.resize(renderer.getResolution());

            } else {
                for (var k in data) {
                    var value = data[k];
                    this.updateDisplay(k, value, display, forward, force);
                }
            }
        },

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateSources: function (data, display, forward, force) {

            for (var k in data) {
                var value = data[k];
                this.updateSource(k, value, display, forward, force);
            }

        }
    }
})();