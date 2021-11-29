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
 */
document.addEventListener('DOMContentLoaded', function () {

    let animation = new HC.Animation(G_INSTANCE);
    messaging = new HC.Messaging(animation);
    let config = new HC.Config(messaging);

    messaging.connect(function (reconnect, animation) {

        HC.log(animation.name, 'connected', true, true);

        if (!reconnect) {
            config.loadConfig((config) => {
                config.initControlSets();
                animation.init(config);
                animation.loadSession();
            });
        }
    });
});

{

    HC.Animation = class Animation extends HC.Program {
        /**
         * @type {HC.Renderer}
         */
        renderer;

        /**
         * @type {HC.LayeredControlSetsManager}
         */
        settingsManager;

        /**
         * @type {HC.Monitor}
         */
        monitor;


        constructor(name) {
            super(name);
            this.now = HC.now();
            this.last = this.now;
            this.running = false;
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
         * @param {HC.Config}config
         */
        init(config) {
            this.config = config;
            this.audioManager = new HC.AudioManager();
            this.audioAnalyser = new HC.AudioAnalyser(this);
            this.beatKeeper = new HC.BeatKeeper(() => {return this.now;}, config);
            this.settingsManager = new HC.LayeredControlSetsManager(config.AnimationValues);

            let renderer = new HC.Renderer(this, {
                layers: new Array(config.ControlValues.layers)
            });
            this.renderer = renderer;
            renderer.initLayers(false);

            let displayManager = new HC.DisplayManager(this, {
                display: new Array(config.DisplayValues.display.length)
            });
            displayManager.resize(this.getResolution());
            this.displayManager = displayManager;

            this.sourceManager = new HC.SourceManager(this, {
                config: config,
                sample: new Array(config.SourceValues.sample.length)
            });

            if (IS_ANIMATION) {
                this.initEvents();
                this.initResize();
                this.initSuperGau();
            }
        }

        /**
         *
         * @param {HC.Messaging} messaging
         */
        setMessaging(messaging) {
            this.messaging = messaging;
        }

        /**
         *
         */
        animate() {

            this._preAnimate();

            HC.EventManager.fireEvent(EVENT_ANIMATION_ANIMATE);


        }

        _preAnimate() {
            let speed = this.beatKeeper.getDefaultSpeed();

            if (IS_ANIMATION && speed.starting()) {

                let detectedSpeed = false;

                if (this.audioManager.isActive()) {

                    if (this.config.ControlSettings.peak_bpm_detect && this.audioAnalyser.peakReliable) {

                        detectedSpeed = this.beatKeeper.speedByPeakBpm(this.audioAnalyser.firstPeak, this.audioAnalyser.peakBPM, this.config.ControlSettings.tempo);

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
                    volume: this.config.ControlSettings.volume,
                    tempo: this.config.ControlSettings.tempo,
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

                HC.EventManager.fireEvent(EVENT_AUDIO_PEAK, this.audioAnalyser);
            }
        }

        /**
         *
         */
        render() {
            HC.EventManager.fireEvent(EVENT_ANIMATION_RENDER);
            if (IS_ANIMATION) {
                this.sourceManager.render();
            }
            this.displayManager.render();
        }

        /**
         *
         */
        updatePlay() {
            if (IS_MONITOR) {
                this.config.ControlSettings.play = this.config.ControlSettings.monitor;
            }

            if (this.config.ControlSettings.play) {
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
            HC.EventManager.fireEvent(EVENT_ANIMATION_PLAY, this);

            let render = () => {
                if (this.running) {
                    if (this.stats) {
                        this.stats.begin();
                    }
                    this.updateRuntime();

                    this.beatKeeper.updateSpeeds(this.diff, this.config.ControlSettings.tempo);

                    this.animate();
                    this.render();

                    if (this.stats) {
                        this.stats.end();
                        this.fps = this.stats.values().fps;
                        this.ms = this.stats.values().ms;
                    }

                    if (this.config.DisplaySettings.fps < 60) {
                        setTimeout(function () {
                            requestAnimationFrame(render);
                        }, this.duration - this.ms); // substract spent time from timeout

                    } else {
                        requestAnimationFrame(render);
                    }

                } else {
                    HC.EventManager.fireEvent(EVENT_ANIMATION_PAUSE, this);
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
            this.duration = 1000 / this.config.DisplaySettings.fps;
            this.diffPrc = this.diff / (1000 / 60);
            this.rms = this.duration - this.ms;
            this._rmsc++;
            this._rmss += this.rms;
            this.last = this.now;
        }

        /**
         *
         */
        fakeAudio() {
            let speed = this.beatKeeper.getSpeed('half');
            this.audioAnalyser.fakeVolume(this.beatKeeper.speeds);

            if (speed.starting()) {
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
            let value = this.config.ControlSettings.audio;
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
                let vo = Math.min(2, Math.max(0.5, this.config.ControlSettings.volume + gain));
                // this.config.ControlSettings.volume = vo;
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

            if (this.config.ControlSettings.beat) {
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

                this.messaging.emitMidi('glow', MIDI_BEAT_FEEDBACK, {timeout: 125});
                if (detectedSpeed) {
                    this.messaging.emitMidi('glow', MIDI_PEAKBPM_FEEDBACK, {timeout: 15000 / detectedSpeed, times: 8});
                }

                if (this.beatKeeper.getSpeed('half').starting()) {
                    for (let i = 0; i < this.config.SourceValues.sequence.length; i++) {
                        let parent = this.sourceManager.getSequenceHasParent(i);
                        let use = this.sourceManager.getSampleBySequence(i);
                        if (parent) {
                            this.messaging.emitMidi('glow', MIDI_ROW_TWO[i], {timeout: 125});
                        }
                        if (use !== 'off') {
                            this.messaging.emitMidi('glow', MIDI_ROW_ONE[use], {timeout: 125});
                        }
                    }
                }
            }

            this.messaging.emitAttr('#layers', 'data-mnemonic', (this.renderer.currentLayer.index + 1));

            if (this.stats) {
                let vals = [
                    'fps:' + this.fps,
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

                if ('controls' in session) {
                    HC.log('controls', 'synced');
                    let controls = session.controls;
                    this.updateControls(controls, true, false, true);
                }

                this.sourceManager.updateSources();
                this.reset();

                if (IS_MONITOR) {
                    this.monitor = new HC.Monitor();
                    this.monitor.init(this.config, () => {
                        this.displayManager.updateDisplay(0);
                        this.initResize();
                        this.updatePlay();
                    });
                }
            };

            this.messaging.sync(callback);
        }

        /**
         *
         */
        fullReset() {
            HC.EventManager.fireEvent(EVENT_FULL_RESET, this);
        }

        /**
         *
         */
        reset() {
            HC.EventManager.fireEvent(EVENT_RESET, this);
        }

        /**
         *
         * @param layer
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateSetting(layer, data, display, forward, force) {

            if (layer === undefined) {
                layer = this.config.ControlSettings.layer;
            }

            let updated = this.settingsManager.updateData(layer, data);
            let property;
            let value;
            if (isArray(updated)) {
                property = updated[0].property;
                value = updated[0].value;
            }

            switch (property) {
                case 'shaders':
                    HC.EventManager.fireEventId(EVENT_LAYER_UPDATE_SHADERS, layer, this, SKIP_TEN_FRAMES);
                    break;

                case 'shape_vertices':
                    if (display) {
                        HC.EventManager.fireEventId(EVENT_LAYER_RESET_SHAPES, layer, this, SKIP_TEN_FRAMES);
                    }
                    break;
            }

            if (forward === true) {
                this.messaging.emitSettings(layer, data, true, false, force);
            }

            HC.EventManager.fireEvent(EVENT_ANIMATION_UPDATE_SETTING, {layer: layer, item: property, value: value});
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

            if (item === 'beat') {
                value = this.beatKeeper.trigger(value);

            } else if (item === 'session' && value !== _HASH) {
                document.location.hash = value;
                setTimeout(function () {
                    document.location.reload();
                }, 250);
                return;
            }

            value = this.config.ControlSettingsManager.updateItem(item, value);

            if (forward === true) {
                let data = {};
                data[item] = value;
                this.messaging.emitControls(data, true, false, force);
            }

            if (display) {
                switch (item) {
                    case 'reset':
                        if (value) {

                            if (force) {
                                console.log('full reset');
                                assetman.disposeAll();
                                this.beatKeeper.reset();
                                HC.EventManager.fireEvent(EVENT_FULL_RESET, this);

                            } else {
                                console.log('layer reset');
                                assetman.disposeAll();
                                HC.EventManager.fireEventId(EVENT_LAYER_RESET, this.config.ControlSettings.layer, this);
                            }
                            this.updateControl('reset', false, false, true, false);
                        }
                        break;

                    case 'layer':
                        this.renderer.nextLayer = this.renderer.layers[value];
                        break;

                    case 'monitor':
                        if (!IS_MONITOR) {
                            break;
                        }
                    case 'play':
                        this.updatePlay();
                        break;

                    case 'audio':
                        if (!IS_MONITOR) {
                            this.updateAudio();
                        }
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

            value = this.config.SourceSettingsManager.updateItem(item, value);

            if (forward === true) {
                let data = {};
                data[item] = value;
                this.messaging.emitSources(data, true, false, force);
            }

            if (display) {
                if (item.match(/^sample\d+_load/) && value) {
                    if (IS_MONITOR) {
                        this.sourceManager.loadSample(HC.numberExtract(item, 'sample'), value);
                    }
                    this.updateSource(item, false, false, true, false);

                } else if (item.match(/^sample\d+_/)) {
                    this.sourceManager.updateSample(HC.numberExtract(item, 'sample'));

                    if (item.match(/sample\d+_(enabled|record)/)) { // never let samples be selected on enabled/record status change
                        HC.EventManager.fireEvent(EVENT_SAMPLE_STATUS_CHANGED, this.sourceManager.getSample(HC.numberExtract(item, 'sample')));
                    }

                } else if (item.match(/display\d+_source/)) {
                    let display = this.displayManager.getDisplay(HC.numberExtract(item, 'display'));
                    this.sourceManager.updateSource(display);

                } else if (item.match(/display\d+_sequence/)) {
                    this.sourceManager.updateSource(this.displayManager.getDisplay(HC.numberExtract(item, 'display')));
                }
            }

            HC.EventManager.fireEvent(EVENT_SOURCE_SETTING_CHANGED, arguments);
        }

        /**
         *
         * @param data
         */
        updateData(data) {

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
                    this.displayManager.centerDisplay(HC.numberExtract(item, 'display'), value);
                    this.updateDisplay(item, false, display, true);
                }
                this.config.DisplaySettingsManager.updateItem(item, value);

            } else {

                value = this.config.DisplaySettingsManager.updateItem(item, value);

                if (forward === true) {
                    let data = {};
                    data[item] = value;
                    this.messaging.emitDisplays(data, true, false, force);
                }

                if (display) {
                    switch (item) {
                        case 'resolution':
                            HC.EventManager.fireEvent(EVENT_RESIZE, this);
                            break;

                        case 'mapping':
                        // case 'clip_context':
                        case 'background':
                            this.displayManager.updateDisplays();
                            break;

                        case 'brightness':
                            this.displayManager.brightness(value);
                            break;

                        case 'display_visibility':
                            this.displayManager.settings.visibility.random = false;
                            break;
                    }
                }

                if (item.match(/^display\d+_/)) {

                    let i = HC.numberExtract(item, 'display');

                    if (item.match(/_mask$/)) { // mask
                        this.displayManager.updateDisplay(i, 'mask');

                    } else if (item.match(/_mapping/)) { // mapping
                        this.displayManager.updateDisplay(i, 'mapping'); // avoid removing/adding maptastic layer

                    } else { // anything else
                        this.displayManager.updateDisplay(i);
                    }
                }
            }
        }

        /**
         *
         * @param layer
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateSettings(layer, data, display, forward, force) {

            if (force) {
                this.settingsManager.updateData(layer, data);
                HC.EventManager.fireEventId(EVENT_LAYER_RESET, layer, this);

            } else {
                for (let k in data) {
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
            for (let k in data) {
                let value = data[k];
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
                for (let k in data) {
                    this.config.DisplaySettingsManager.updateItem(k, data[k]);
                }
                this.displayManager.reset();
                // this.fullReset(true);

            } else {
                for (let k in data) {
                    let value = data[k];
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

            for (let k in data) {
                let value = data[k];
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
         * @returns {{aspect: number, x: number, y: number}}
         */
        getResolution() {
            let resolution;

            let res = this.config.DisplaySettings.resolution;
            if (res) {
                let sp = res.split(/[\:x]/);
                if (sp.length > 1) {
                    let w = parseInt(sp[0]);
                    let h = parseInt(sp[1]);
                    resolution = {x: w, y: h, aspect: w / h, diameter: new THREE.Vector2(w, h).length()};
                }
            }

            return resolution;
        }

        /**
         *
         */
        initSuperGau() {
            HC.EventManager.register(EVENT_WEBGL_CONTEXT_LOST, this.name, () => {
                // now reset...
                HC.log('HC.Renderer', 'another context loss...', true, true);

                for (let i = 0; i < this.config.SourceValues.sample.length; i++) {
                    this.updateSource(getSampleKey(i), false, true, true, false);
                }
                this.updateSource('override_material_input', 'none', true, true, false);
                this.updateSource('override_background_mode', 'none', true, true, false);

                // todo maybe send full reset anywhere and reload page

            });

            this.messaging.emitAttr('#play', 'data-color', '');
        }
    }
}
