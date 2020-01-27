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
 * @type {HC.Animation}
 */
let animation;

/**
 *
 * @type {HC.BeatKeeper}
 */
let beatKeeper;
/**
 * @type {HC.AudioAnalyser}
 */
let audio;
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

    messaging.connect(function (reconnect, animation) {

        HC.log(animation.name, 'connected', true, true);

        if (!reconnect) {
            loadResources(setupResources(), function () {

                statics.DisplaySettingsManager = new HC.ControlSetsManager(HC.Statics.initDisplayControlSets());
                statics.DisplaySettings = statics.DisplaySettingsManager.settingsProxy();
                statics.SourceSettingsManager = new HC.ControlSetsManager(HC.Statics.initSourceControlSets());
                statics.SourceSettings = statics.SourceSettingsManager.settingsProxy();
                statics.ControlSettingsManager = new HC.ControlSetsManager(HC.Statics.initControlControlSets());
                statics.ControlSettings = statics.ControlSettingsManager.settingsProxy();

                let listener = new HC.Listener();
                animation.listener = listener;
                let audioManager = new HC.AudioManager();
                animation.audioManager = audioManager;
                audio = new HC.AudioAnalyser(audioManager.audioContext);
                animation.audioAnalyser = audio;
                beatKeeper = new HC.BeatKeeper();
                animation.beatKeeper = beatKeeper;

                let renderer = new HC.Renderer(animation, {
                    layers: new Array(statics.ControlValues.layer.length)
                });
                animation.renderer = renderer;

                if (IS_ANIMATION) {
                    animation.listener.register('webglcontextlost', animation.name, function () {
                        // now reset...
                        HC.log('HC.Renderer', 'another context loss...', true, true);

                        if (DEBUG) {
                            for (let i in MIDI_ROW_ONE) { // glContext messed up... make that clear
                                animation.messaging.emitMidi('glow', MIDI_ROW_ONE[i], {timeout: 500, times: 15});
                                animation.messaging.emitMidi('glow', MIDI_ROW_TWO[i], {timeout: 500, times: 15});
                                animation.messaging.emitAttr('#play', 'data-color', 'red');
                            }

                        } else {
                            window.location.reload(true);
                        }
                    });

                    animation.messaging.emitAttr('#play', 'data-color', '');
                }

                cm = new HC.LayeredControlSetsManager(renderer.layers, statics.AnimationValues);

                let displayManager = new HC.DisplayManager(animation, {
                    display: new Array(statics.DisplayValues.display.length)
                });
                displayManager.resize(renderer.getResolution());
                animation.displayManager = displayManager;

                let sourceManager = new HC.SourceManager(animation, {
                    sequence: new Array(statics.SourceValues.sequence.length),
                    sample: new Array(statics.SourceValues.sample.length)
                });
                sourceManager.resize(renderer.getResolution());
                animation.sourceManager = sourceManager;

                new HC.Animation.KeyboardListener().init();
                new HC.Animation.EventListener().init();

                animation._perspectiveHook = function () {
                    sourceManager.renderPerspectives();
                };

                animation.loadSession();
            });
        }
    });
});

{
    /**
     *
     * @type {HC.Animation}
     */
    HC.Animation = class Animation extends HC.Messageable {

        /**
         * @type {HC.Messaging}
         */
        messaging;

        /**
         *
         * @type {HC.SourceManager}
         */
        sourceManager;

        /**
         * @type {HC.AudioManager}
         */
        audioManager;

        /**
         * @type {HC.AudioAnalyser}
         */
        audioAnalyser;

        /**
         * @type {HC.DisplayManager}
         */
        displayManager;

        /**
         * @type {HC.BeatKeeper}
         */
        beatKeeper;

        /**
         * @type {HC.Listener}
         */
        listener;

        /**
         * @type {HC.Renderer}
         */
        renderer;


        constructor(name) {
            super(name);
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

        /**
         *
         * @param {HC.Messaging} messaging
         */
        setMessaging(messaging) {
            this.messaging = messaging;
        }

        animate() {

            /**
             * do general stuff
             */
            let speed = this.beatKeeper.getDefaultSpeed();

            if (IS_ANIMATION && speed.starting()) {

                let detectedSpeed = false;

                if (this.audioManager.isActive()) {

                    if (statics.ControlSettings.peak_bpm_detect && this.audioAnalyser.peakReliable) {

                        detectedSpeed = this.beatKeeper.speedByPeakBpm(this.audioAnalyser.firstPeak, this.audioAnalyser.peakBPM, statics.ControlSettings.tempo);

                        if (detectedSpeed) {
                            this.audioAnalyser.peakReliable = false;
                            this.messaging.emitLog('peakBPM', detectedSpeed);
                            this.updateControl('tempo', detectedSpeed, true, true);
                        }
                    }

                    this.autoVolume();
                }

                this.postStatus(detectedSpeed);
            }

            if (this.audioManager.isActive()) {
                let config = {
                    useWaveform: this.renderer.currentLayer.settings.audio_usewaveform,
                    volume: statics.ControlSettings.volume,
                    // resetPeakCountAfter: statics.ControlSettings.shuffle_every,
                    tempo: statics.ControlSettings.tempo,
                    minDiff: this.beatKeeper.getSpeed('sixteen').duration,
                    now: this.now,
                    thickness: this.renderer.currentLayer.settings.audio_thickness
                };
                this.audioAnalyser.update(config);

            } else {
                this.fakeAudio();
            }

            if (this.audioAnalyser.peak) {
                this.messaging.emitMidi('glow', MIDI_PEAK_FEEDBACK, {timeout: 125});

                this.listener.fireEvent('audio.peak', this.audioAnalyser);
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
            this.renderer.switchLayer(IS_MONITOR);

            let hook = this.doNotDisplay ? false : this._perspectiveHook;
            this.renderer.animate(hook);

        }

        /**
         *
         */
        render() {
            if (IS_ANIMATION) {
                this.sourceManager.render();
            }
            if (!this.doNotDisplay) {
                this.displayManager.render();
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
        }

        /**
         *
         */
        play() {
            if (this.running) return;
            this.running = true;

            if (this.lastUpdate) {
                this.lastUpdate = this.now - this.lastUpdate;
            }
            this.beatKeeper.play();
            this.renderer.resumeLayers();

            let render = () => {
                if (this.running) {
                    if (this.stats) {
                        this.stats.begin();
                    }
                    this.updateRuntime();

                    this.beatKeeper.updateSpeeds(this.diff, statics.ControlSettings.tempo);

                    if (this.beatKeeper.getSpeed('sixteen').starting()) {
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
                    this.renderer.pauseLayers();
                    this.beatKeeper.stop();
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

            this.listener.fireEvent('animation.updateRuntime', this);
        }

        /**
         *
         */
        fakeAudio() {
            let speed = this.beatKeeper.getSpeed('half');
            this.audioAnalyser.volume = Math.random();
            this.audioAnalyser.volumes = new Array(this.audioAnalyser.binCount).fill(0).map(Math.random);
            if (speed.progress <= 0) {
                this.audioAnalyser.peak = true;

            } else {
                this.audioAnalyser.peak = false;
            }
        }

        /**
         *
         */
        updateAudio() {
            this.audioAnalyser.reset();
            let value = statics.ControlSettings.audio;
            if (value) {
                this.audioManager.stop();
                this.audioManager.initPlugin(value, (source) => {
                    let analyser = this.audioAnalyser.createAnalyser(this.audioManager.context);
                    source.connect(analyser);
                    this.audioManager.start();
                });

            } else {
                this.audioManager.stop();
            }
        }

        /**
         *
         */
        autoVolume() {
            let gain = 0;
            if (this.audioAnalyser.avgVolume < 0.10) {
                gain += 0.1;

            } else if (this.audioAnalyser.avgVolume < 0.20) {
                gain += 0.05;

            } else if (this.audioAnalyser.avgVolume < 0.26) {
                gain += 0.005;

            } else if (this.audioAnalyser.avgVolume > 0.46) {
                gain -= 0.1;

            } else if (this.audioAnalyser.avgVolume > 0.36) {
                gain -= 0.05;

            } else if (this.audioAnalyser.avgVolume > 0.30) {
                gain -= 0.005;
            }

            if (gain !== 0) {
                //console.log('gain', [this.audioAnalyser.volume, this.audioAnalyser.avgVolume, gain]);
                let vo = Math.min(2, Math.max(0.5, statics.ControlSettings.volume + gain));
                // statics.ControlSettings.volume = vo;
                this.updateControl('volume', vo, false, false, false);
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

            if (statics.ControlSettings.beat) {
                let speed = this.beatKeeper.getDefaultSpeed();
                let color = detectedSpeed ? 'green' : (this.audioAnalyser.peakReliable ? 'yellow' : '');

                this.messaging.emitAttr('#beat', 'color', color, '', speed.duration);

                let btk = ['bpm:' + this.beatKeeper.bpm,
                    'b:' + speed.beats,
                    'd:' + speed.duration.toFixed(0),
                    'p:' + this.beatKeeper.speeds.quarter.pitch.toFixed(0)
                ];

                this.messaging.emitAttr('#beat', 'data-label', btk.join(' / '));

                if (this.audioManager.isActive()) {
                    let au = [
                        round(this.audioAnalyser.avgVolume, 2) + '',
                        this.audioAnalyser.peakBPM.toFixed(2),
                    ];
                    this.messaging.emitAttr('#audio', 'data-label', au.join(' / '));
                }
                //messaging.emitAttr('#beat', 'data-color', 'red', 'green');<
                this.messaging.emitMidi('glow', MIDI_BEAT_FEEDBACK, {timeout: 125});
                if (detectedSpeed) {
                    this.messaging.emitMidi('glow', MIDI_PEAKBPM_FEEDBACK, {timeout: 15000 / detectedSpeed, times: 8});
                }
                if (statics.DisplaySettings.display_speed == 'midi') {
                    this.messaging.emitMidi('clock', MIDI_CLOCK_NEXT, {duration: this.beatKeeper.getDefaultSpeed().duration});
                }

                if (this.beatKeeper.getSpeed('half').starting()) {
                    for (let i = 0; i < statics.SourceValues.sequence.length; i++) {
                        let parent = getSequenceHasParent(i);
                        let use = getSampleBySequence(i);
                        if (parent) {
                            this.messaging.emitMidi('glow', MIDI_ROW_TWO[i], {timeout: 125});
                        }
                        if (use != 'off') {
                            this.messaging.emitMidi('glow', MIDI_ROW_ONE[use], {timeout: 125});
                        }
                    }
                }
            }

            this.messaging.emitAttr('#layers', 'data-mnemonic', (this.renderer.currentLayer.index + 1));

            if (this.stats) {
                let state = (this.powersave ? 'i' : '') + (this.offline ? 'o' : '');
                let vals = [
                    'fps:' + this.fps + state,
                    'rms:' + this.rmsAverage()];
                this.messaging.emitAttr('#play', 'data-label', vals.join(' / '));
            }
        }

        /**
         *
         */
        loadSession() {

            let callback = (session) => {

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

                this.sourceManager.updateSequences();
                this.fullReset(true);

                if (IS_MONITOR) {
                    new HC.Monitor().init(() => {
                        this.displayManager.updateDisplay(0);
                        new HC.Animation.ResizeListener().init(animation.displayManager);
                    });
                } else {
                    new HC.Animation.ResizeListener().init(animation.displayManager);
                }
            };

            this.messaging.sync(callback);
        }

        /**
         *
         * @param keepsettings
         */
        fullReset(keepsettings) {
            this.renderer.fullReset(keepsettings);
            this.sourceManager.resize(this.renderer.getResolution());
            this.displayManager.resize(this.renderer.getResolution());
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

            // if (!renderer)return;

            let layerIndex = layer;
            layer = this.renderer.layers[layer];

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
                    this.renderer.resetLayer(layer);
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
                this.messaging.emitSettings(layerIndex, data, true, false, force);
            }

            this.listener.fireEvent('animation.updateSetting', {layer: layer, item: property, value: value});
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

            if (item == 'beat') {
                value = this.beatKeeper.trigger(value);

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
                this.messaging.emitControls(data, true, false, force);
            }

            if (display) {
                switch (item) {
                    case 'reset':
                        if (this.renderer) {
                            if (force) {
                                this.beatKeeper.reset();
                                this.fullReset(false);

                            } else {
                                this.renderer.resetLayer(this.renderer.currentLayer);
                            }
                        }
                        break;

                    case 'layer':
                        // audio.peakCount = 0; // disable shuffle for [shuffle every] count of peaks
                        this.renderer.nextLayer = this.renderer.layers[value];
                        break;

                    // case 'tempo':
                    //
                    //     break;

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
                this.messaging.emitSources(data, true, false, force);
            }

            if (display) {
                let action = false;
                // if (item.match(/^sample\d+_store/) && value) {
                //     //var sample =
                //     sourceManager.storeSample(number_extract(item, 'sample'), value, 1, false);
                //     this.updateSource(item, false, false, true, false);
                //
                // } else
                if (item.match(/^sample\d+_load/) && value) {
                    if (IS_MONITOR || display) {
                        this.sourceManager.loadSample(numberExtract(item, 'sample'), value);
                    }
                    this.updateSource(item, false, false, true, false);

                } else if (item.match(/^sample\d+_/)) {
                    this.sourceManager.updateSample(numberExtract(item, 'sample'));
                    action = true;

                } else if (item.match(/^sequence\d+_/)) {
                    this.sourceManager.updateSequence(numberExtract(item, 'sequence'));
                    action = true;

                } else if (item.match(/display\d+_source/)) {
                    var display = this.displayManager.getDisplay(numberExtract(item, 'display'));
                    this.sourceManager.updateSource(display);

                    if (display && display.isFixedSize()) {
                        this.displayManager.updateDisplay(display.index, false);
                    }

                    action = true;

                } else if (item.match(/display\d+_sequence/)) {
                    this.sourceManager.updateSource(this.displayManager.getDisplay(numberExtract(item, 'display')));
                    action = true;

                } else if (item.match(/^lighting_(lights|scale)/)) {
                    this.displayManager.updateDisplays();
                    action = true;

                } else if (item.match(/^lighting_(mode|color)/)) {
                    this.sourceManager.getLighting(0).update();
                    action = true;
                }

                if (action) {
                    this.offline = false;
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
            if (this.listener && data.command == 'message') {
                this.listener.fireEvent('midi.message', data.data);
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
                    this.displayManager.centerDisplay(numberExtract(item, 'display'), value);
                    this.updateDisplay(item, false, display, true);
                }
                statics.DisplaySettingsManager.updateItem(item, value);

            } else {

                value = statics.DisplaySettingsManager.updateItem(item, value);

                if (forward === true) {
                    var data = {};
                    data[item] = value;
                    this.messaging.emitDisplays(data, true, false, force);
                }

                if (display) {
                    switch (item) {
                        case 'resolution':
                            this.fullReset(true);
                            break;

                        case 'mapping':
                        case 'clip_context':
                        case 'background':
                            this.displayManager.updateDisplays();
                            break;

                        case 'brightness':
                            this.displayManager.brightness(value);
                            break;

                        case 'display_visibility':
                        case 'border_mode':
                            this.displayManager.settings.visibility.random = false;
                            this.displayManager.settings.border.random = false;
                            break;
                    }
                }

                if (item.match(/^display\d+_/)) {

                    var i = numberExtract(item, 'display');

                    if (item.match(/_mask$/)) { // mask
                        this.displayManager.updateDisplay(i, 'mask');

                    } else if (item.match(/_mapping/)) { // mapping
                        this.displayManager.updateDisplay(i, 'mapping'); // avoid removing/adding maptastic layer

                    } else { // anything else
                        this.displayManager.updateDisplay(i);
                        this.offline = false;
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

                this.renderer.resetLayer(layer);

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
                this.displayManager.reset();
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
         * Keep in mind: If durations in HC.BeatKeeper.speeds change due to pitching, this will not return usable values for smooth animations.
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
                    this.renderer.nextLayer = this.renderer.layers[result];
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
