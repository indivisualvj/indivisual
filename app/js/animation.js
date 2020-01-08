/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

/**
 *
 * @type {HC.Messaging}
 */
let messaging;
/**
 *
 * @type {HC.AudioManager}
 */
let audioman;
/**
 *
 * @type {HC.Animation}
 */
let animation;
/**
 *
 * @type {HC.Renderer}
 */
let renderer;
/**
 *
 * @type {HC.Beatkeeper}
 */
let beatkeeper;
/**
 * @type {HC.AudioAnalyser}
 */
let audio;
/**
 *
 * @type {HC.DisplayManager}
 */
let displayman;
/**
 *
 * @type {HC.SourceManager}
 */
let sourceman;
/**
 *
 * @type {HC.Listener}
 */
let listener;
/**
 *
 * @type {HC.LayeredControlSetsManager}
 */
let cm;

/**
 *
 */
document.addEventListener('DOMContentLoaded', function () {

    animation = new HC.Animation(G_INSTANCE);
    messaging = new HC.Messaging(animation);

    messaging.connect(function (reconnect) {

        HC.log(animation.name, 'connected', true, true);

        if (!reconnect) {
            loadResources(setupResources(), function () {

                statics.DisplaySettingsManager = new HC.ControlSetsManager(HC.Statics.initDisplayControlSets());
                statics.DisplaySettings = statics.DisplaySettingsManager.settingsProxy();
                statics.SourceSettingsManager = new HC.ControlSetsManager(HC.Statics.initSourceControlSets());
                statics.SourceSettings = statics.SourceSettingsManager.settingsProxy();
                statics.ControlSettingsManager = new HC.ControlSetsManager(HC.Statics.initControlControlSets());
                statics.ControlSettings = statics.ControlSettingsManager.settingsProxy();

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
                        HC.log('HC.Renderer', 'another context loss...', true, true);

                        if (DEBUG) {
                            for (let i in MIDI_ROW_ONE) { // glContext messed up... make that clear
                                messaging.emitMidi('glow', MIDI_ROW_ONE[i], {timeout: 500, times: 15});
                                messaging.emitMidi('glow', MIDI_ROW_TWO[i], {timeout: 500, times: 15});
                            }

                        } else {
                            window.location.reload(true);
                        }
                    });
                }

                cm = new HC.LayeredControlSetsManager(renderer.layers, statics.AnimationValues);

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

                new HC.Animation.KeyboardListener().init();
                new HC.Animation.EventListener().init();

                animation._perspectiveHook = function () {
                    sourceman.renderPerspectives();
                };

                let callback = function (data) {
                    animation.loadSession(data);

                    if (IS_MONITOR) {
                        new HC.Monitor().init(function () {
                            displayman.updateDisplay(0);
                            new HC.Animation.ResizeListener().init();
                        });
                    } else {
                        new HC.Animation.ResizeListener().init();
                    }
                };
                messaging.sync(callback);
            });
        }
    });
});

{
    /**
     *
     * @type {HC.Animation}
     */
    HC.Animation = class Animation {

        constructor(name) {
            this.name = name;
            this.now = HC.now();
            this.last = this.now;
            this.running = false;
            this.offline = false;
            this.powersave = false;
            this.doNotDisplay = false; // render displays only every second frame if FPS is set to 60
            this.diff = 0;
            this.diffPrc = 1;
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
        }

        animate() {

            /**
             * do general stuff
             */
            let speed = beatkeeper.getDefaultSpeed();

            if (IS_ANIMATION && speed.starting()) {

                let detectedSpeed = false;

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

            if (audioman.isActive()) {
                let config = {
                    useWaveform: renderer.currentLayer.settings.audio_usewaveform,
                    volume: statics.ControlSettings.volume,
                    // resetPeakCountAfter: statics.ControlSettings.shuffle_every,
                    tempo: statics.ControlSettings.tempo,
                    minDiff: beatkeeper.getSpeed('sixteen').duration,
                    now: this.now,
                    thickness: renderer.currentLayer.settings.audio_thickness
                };
                audio.update(config);

            } else {
                this.fakeAudio();
            }

            if (audio.peak) {
                messaging.emitMidi('glow', MIDI_PEAK_FEEDBACK, {timeout: 125});

                listener.fireEvent('audio.peak', audio);
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

            let hook = this.doNotDisplay ? false : this._perspectiveHook;
            renderer.animate(hook);

        }

        /**
         *
         */
        render() {
            if (IS_ANIMATION) {
                sourceman.render();
            }
            if (!this.doNotDisplay) {
                displayman.render();
            }
        }

        /**
         *
         */
        updatePlay() {
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
        }

        /**
         *
         */
        play() {
            if (this.running) return;
            this.running = true;

            if (this.lastUpdate) {
                this.lastUpdate = animation.now - this.lastUpdate;
            }
            beatkeeper.play();
            renderer.resumeLayers();

            let render = () => {
                if (this.running) {
                    if (this.stats) {
                        this.stats.begin();
                    }
                    this.updateRuntime();

                    beatkeeper.updateSpeeds(this.diff, statics.ControlSettings.tempo);

                    if (beatkeeper.getSpeed('sixteen').starting()) {
                        this.doNotDisplay = false;

                    } else if (statics.DisplaySettings.fps < 46) {
                        this.doNotDisplay = false;

                    } else {
                        this.doNotDisplay = !this.doNotDisplay;
                    }

                    this.animate();
                    this.render();

                    if (this.stats) {
                        this.stats.end();
                        this.fps = this.stats.values().fps;
                        this.ms = this.stats.values().ms;
                    }

                    if (statics.DisplaySettings.fps < 60) {
                        setTimeout(function () {
                            requestAnimationFrame(render);
                        }, this.duration - this.ms); // substract spent time from timeout

                    } else {
                        requestAnimationFrame(render);
                    }

                } else {
                    renderer.pauseLayers();
                    beatkeeper.stop();
                }
            };

            requestAnimationFrame(render);
        }

        /**
         *
         */
        pause() {
            this.running = false;
            this.lastUpdate = this.now;
        }

        /**
         *
         */
        updateRuntime() {
            this.now = HC.now() - this.lastUpdate;
            this.diff = this.now - this.last;
            this.duration = 1000 / statics.DisplaySettings.fps;
            this.diffPrc = this.diff / (1000 / 60);
            this.rms = this.duration - this.ms;
            this._rmsc++;
            this._rmss += this.rms;
            this.last = this.now;

            listener.fireEvent('animation.updateRuntime', this);
        }

        /**
         *
         */
        fakeAudio() {
            let speed = beatkeeper.getSpeed('half');
            audio.volume = Math.random();
            audio.volumes = new Array(audio.binCount).fill(0).map(Math.random);
            if (speed.progress <= 0) {
                audio.peak = true;
                // audio.peakCount += speed.beats;
                //
                // if (audio.peakCount > statics.ControlSettings.shuffle_every) { // doubled due to audio off
                //     audio.peakCount = 0;
                // }

            } else {
                audio.peak = false;
            }
        }

        updateAudio() {
            audio.reset();
            let value = statics.ControlSettings.audio;
            if (value) {
                audioman.stop();
                audioman.initPlugin(value, function (source) {
                    let analyser = audio.createAnalyser(audioman.context);
                    source.connect(analyser);
                    audioman.start();
                });

            } else {
                audioman.stop();
            }
        }

        /**
         *
         */
        autoVolume() {
            let gain = 0;
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
                let vo = Math.min(2, Math.max(0.5, statics.ControlSettings.volume + gain));
                // statics.ControlSettings.volume = vo;
                animation.updateControl('volume', vo, false, false, false);
            }
        }

        /**
         *
         * @param multiplier
         * @returns {number}
         */
        threadTimeout(multiplier) {
            let diff = Math.max(0, 60 - this.fps);
            let ms = 1000 / this.fps;
            return ms * multiplier + ms * diff * multiplier;
        }

        /**
         *
         * @returns {number}
         */
        rmsAverage() {
            let rmsa = this._rmss / this._rmsc;
            this._rmss = this._rmsc = 0;

            return rmsa.toFixed(1);
        }

        /**
         *
         * @param detectedSpeed
         */
        postStatus(detectedSpeed) {

            let color = detectedSpeed ? 'green' : (audio.peakReliable ? 'yellow' : 'red');
            messaging.emitAttr('#sync', 'data-color', color);

            if (statics.ControlSettings.beat) {
                let speed = beatkeeper.getDefaultSpeed();
                let btk = ['bpm:' + beatkeeper.bpm,
                    'b:' + speed.beats,
                    'd:' + speed.duration.toFixed(0),
                    'p:' + beatkeeper.speeds.quarter.pitch.toFixed(0)
                ];

                messaging.emitAttr('#beat', 'data-label', btk.join(' / '));

                let vo = round(audio.avgVolume, 2) + '';
                messaging.emitAttr('#audio', 'data-mnemonic', vo);

                if (audioman.isActive()) {
                    let au = [
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

                if (beatkeeper.getSpeed('half').starting()) {
                    for (let i = 0; i < statics.SourceValues.sequence.length; i++) {
                        let parent = getSequenceHasParent(i);
                        let use = getSampleBySequence(i);
                        if (parent) {
                            messaging.emitMidi('glow', MIDI_ROW_TWO[i], {timeout: 125});
                        }
                        if (use != 'off') {
                            messaging.emitMidi('glow', MIDI_ROW_ONE[use], {timeout: 125});
                        }
                    }
                }
            }

            // let sh = statics.ControlSettings.shuffle;
            // let count = statics.ControlSettings.shuffle_usepeak ? audio.peakCount :
            //     (statics.shuffle.counter % statics.ControlSettings.shuffle_every);
            // messaging.emitAttr('#layer', 'data-label', count + (sh ? 's' : ''));

            let layerDisplayValue = (statics.ControlSettings.layer + 1);
            messaging.emitAttr('#layers', 'data-mnemonic', layerDisplayValue);

            if (animation.stats) {
                let state = (animation.powersave ? 'i' : '') + (animation.offline ? 'o' : '');
                let vals = [
                    'fps:' + animation.fps + state,
                    'rms:' + animation.rmsAverage()];
                messaging.emitAttr('#play', 'data-label', vals.join(' / '));
            }
        }

        /**
         *
         * @param session
         */
        loadSession(session) {

            if ('displays' in session) {
                HC.log('displays', 'synced');
                let displays = session.displays;
                this.updateDisplays(displays, true, false, true);
            }

            if ('sources' in session) {
                HC.log('sources', 'synced');
                let sources = session.sources;
                this.updateSources(sources, true, false, true);
            }

            if ('settings' in session) {
                HC.log('settings', 'synced');
                let settings = session.settings;
                for (let k in settings) {
                    this.updateSettings(k, settings[k], true, false, true);
                }
            }

            // if ('settings' in session) {
            //     HC.log('settings', 'synced');
            //     let settings = session.settings;
            //     for (let k in settings) {
            //         this.updateSettings(k, settings[k], true, false, true);
            //     }
            // }

            if ('controls' in session) {
                HC.log('controls', 'synced');
                let controls = session.controls;
                this.updateControls(controls, true, false, true);
            }

            sourceman.updateSequences();
            this.fullReset(true);
        }

        /**
         *
         * @param keepsettings
         */
        fullReset(keepsettings) {
            renderer.fullReset(keepsettings);
            sourceman.resize(renderer.getResolution());
            displayman.resize(renderer.getResolution());
        }

        /**
         *
         * @param layer
         * @param set
         * @param property
         * @param value
         * @param display
         * @param forward
         * @param force
         */
        updateSetting(layer, data, display, forward, force) {

            if (!renderer)return;

            let layerIndex = layer;
            layer = renderer.layers[layer];

            let updated = cm.updateData(layer, data);
            let property;
            let value;
            if (isArray(updated)) {
                property = updated[0].property;
                value = updated[0].value;
            }

            switch (property) {

                // complete layer reset:
                case 'shape_sizedivider':
                case 'pattern_shapes':
                    renderer.resetLayer(layer);
                    break;

                // shader reset
                case 'shaders':
                    layer.updateShaderPasses();
                    break;

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
                case 'shape_moda':
                case 'shape_modb':
                case 'shape_modc':
                    layer.resetShapes();
                    break;

                // special case for shapetastic
                case 'shape_vertices':
                    if (display) {
                        layer.resetShapes();
                    }
                    break;
            }

            if (forward === true) {
                messaging.emitSettings(layerIndex, data, true, false, force);
            }

            listener.fireEvent('animation.updateSetting', {layer: layer, item: property, value: value});
        }

        /**
         *
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         * @returns {*}
         */
        updateControl(item, value, display, forward, force) {

            if (statics.ControlSettings) {

                if (item == 'beat') {
                    value = beatkeeper.trigger(value, true, statics.ControlSettings.tempo, true);

                } else if (item == 'session' && value != _HASH) {
                    document.location.hash = value;
                    setTimeout(function () {
                        document.location.reload();
                    }, 250);
                    return;
                }

                value = statics.ControlSettingsManager.updateItem(item, value);

                if (forward === true) {
                    let data = {};
                    data[item] = value;
                    messaging.emitControls(data, true, false, force);
                }

                if (display) {
                    switch (item) {
                        case 'reset':
                            if (renderer) {
                                if (force) {
                                    beatkeeper.reset();
                                    this.fullReset(false);

                                } else {
                                    renderer.resetLayer(renderer.currentLayer);
                                }
                            }
                            break;

                        case 'layer':
                            // audio.peakCount = 0; // disable shuffle for [shuffle every] count of peaks
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
                            this.updateAudio();
                            break;

                        case 'shuffle':
                            if (value) {
                                this.shuffleLayer(false);
                            }
                            break;

                    }
                }
            }
        }

        /**
         *
         * @param item
         * @param value
         * @param display means live
         * @param forward
         * @param force
         * @returns {*}
         */
        updateSource(item, value, display, forward, force) {

            value = statics.SourceSettingsManager.updateItem(item, value);

            if (forward === true) {
                let data = {};
                data[item] = value;
                messaging.emitSources(data, true, false, force);
            }

            if (display) {
                let action = false;
                // if (item.match(/^sample\d+_store/) && value) {
                //     //var sample =
                //     sourceman.storeSample(number_extract(item, 'sample'), value, 1, false);
                //     this.updateSource(item, false, false, true, false);
                //
                // } else
                if (item.match(/^sample\d+_load/) && value) {
                    if (IS_MONITOR || display) {
                        sourceman.loadSample(numberExtract(item, 'sample'), value);
                    }
                    this.updateSource(item, false, false, true, false);

                } else if (item.match(/^sample\d+_/)) {
                    sourceman.updateSample(numberExtract(item, 'sample'));
                    action = true;

                } else if (item.match(/^sequence\d+_/)) {
                    sourceman.updateSequence(numberExtract(item, 'sequence'));
                    action = true;

                } else if (item.match(/display\d+_source/)) {
                    var display = displayman.getDisplay(numberExtract(item, 'display'));
                    sourceman.updateSource(display);

                    if (display && display.isFixedSize()) {
                        displayman.updateDisplay(display.index, false);
                    }

                    action = true;

                } else if (item.match(/display\d+_sequence/)) {
                    sourceman.updateSource(displayman.getDisplay(numberExtract(item, 'display')));
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

        /**
         *
         * @param data
         */
        updateData(data) {

        }

        /**
         *
         * @param data
         */
        updateMidi(data) {
            if (listener && data.command == 'message') {
                listener.fireEvent('midi.message', data.data);
            }
        }

        /**
         *
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         */
        updateDisplay(item, value, display, forward, force) {

            if (item.match(/^display\d+_\d/)) { // resize
                if (value) {
                    displayman.centerDisplay(numberExtract(item, 'display'), value);
                    this.updateDisplay(item, false, display, true);
                }
                statics.DisplaySettingsManager.updateItem(item, value);

            } else {

                value = statics.DisplaySettingsManager.updateItem(item, value);

                if (forward === true) {
                    var data = {};
                    data[item] = value;
                    messaging.emitDisplays(data, true, false, force);
                }

                if (display) {
                    switch (item) {
                        case 'resolution':
                            this.fullReset(true);
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
                            statics.display.visibility.random = false;
                            statics.display.border.random = false;
                            break;
                    }
                }

                if (item.match(/^display\d+_/)) {

                    var i = numberExtract(item, 'display');

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
        }

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateSettings(layer, data, display, forward, force) {

            if (force) {
                cm.updateData(layer, data);

                renderer.resetLayer(layer);

            } else {
                for (var k in data) {
                    let value = {};
                    value[k] = data[k];
                    this.updateSetting(layer, value, display, forward, force);
                }
            }
        }

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateControls(data, display, forward, force) {
            for (var k in data) {
                var value = data[k];
                this.updateControl(k, value, display, forward, force);
            }
        }

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateDisplays(data, display, forward, force) {

            if (force) {
                for (var k in data) {
                    statics.DisplaySettingsManager.updateItem(k, data[k]);
                }
                displayman.reset();
                // this.fullReset(true);

            } else {
                for (var k in data) {
                    var value = data[k];
                    this.updateDisplay(k, value, display, forward, force);
                }
            }
        }

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateSources(data, display, forward, force) {

            for (var k in data) {
                var value = data[k];
                this.updateSource(k, value, display, forward, force);
            }

        }

        /**
         * Keep in mind: If durations in HC.Beatkeeper.speeds change due to pitching, this will not return usable values for smooth animations.
         * @param duration
         * @param divider
         * @returns {number}
         */
        getFrameDurationPercent(duration, divider) {
            return this.diffPrc * this.duration / (duration * (divider || 1));
        }

        /**
         *
         */
        doShuffle() {
            var plugin = this.getShuffleModePlugin(statics.ControlSettings.shuffle_mode);

            var result = plugin.apply();
            if (result !== false) {
                result = plugin.after();
                if (result !== false) {
                    renderer.nextLayer = renderer.layers[result];
                }
            }
        }

        /**
         *
         * @param name
         */
        getShuffleModePlugin(name) {
            if (!this.plugins) {
                this.plugins = {};
            }

            if (!this.plugins[name]) {
                this.plugins[name] = new HC.shuffle_mode[name](statics.ControlSettings);
            }

            return this.plugins[name];
        }
    }
}
