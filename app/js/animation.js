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
    animation.config = config;

    messaging.connect(function (reconnect, animation) {

        HC.log(animation.name, 'connected', true, true);

        if (!reconnect) {
            config.loadConfig(() => {
                animation.config.initControlSets();

                animation.listener = new HC.Listener();
                animation.audioManager = new HC.AudioManager();
                animation.audioAnalyser = new HC.AudioAnalyser(animation);
                animation.beatKeeper = new HC.BeatKeeper(animation, animation.config);

                let renderer = new HC.Renderer(animation, {
                    layers: new Array(animation.config.ControlValues.layers)
                });
                animation.renderer = renderer;

                if (IS_ANIMATION) {
                    animation.listener.register('webglcontextlost', animation.name, function () {
                        // now reset...
                        HC.log('HC.Renderer', 'another context loss...', true, true);

                        for (let i = 0; i < animation.config.SourceValues.sample.length; i++) {
                            animation.updateSource(getSampleKey(i), false, true, true, false);
                        }
                        animation.updateSource('override_material_input', 'none', true, true, false);
                        animation.updateSource('override_background_mode', 'none', true, true, false);
                    });

                    animation.messaging.emitAttr('#play', 'data-color', '');
                }

                animation.settingsManager = new HC.LayeredControlSetsManager(
                    renderer.layers,
                    animation.config.AnimationValues
                );
                renderer.initLayers(false);

                let displayManager = new HC.DisplayManager(animation, {
                    display: new Array(animation.config.DisplayValues.display.length)
                });
                displayManager.resize(renderer.getResolution());
                animation.displayManager = displayManager;

                animation.sourceManager = new HC.SourceManager(animation, {
                    config: animation.config,
                    sample: new Array(animation.config.SourceValues.sample.length)
                });

                new HC.Animation.KeyboardListener().init(animation);
                new HC.Animation.EventListener().init();

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

        /**
         *
         */
        animate() {

            this.listener.fireEvent(EVENT_ANIMATION_ANIMATE);

            this._preRender();

            /**
             * do layer stuff
             */
            if (IS_ANIMATION) {
                this.doShuffle();
            }
            this.renderer.switchLayer(IS_MONITOR);

            this.renderer.animate();

        }

        _preRender() {
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
                    // resetPeakCountAfter: this.config.ControlSettings.shuffle_every,
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

                this.listener.fireEvent('audio.peak', this.audioAnalyser);
            }
        }



        /**
         *
         */
        render() {
            this.listener.fireEvent(EVENT_ANIMATION_RENDER);
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
            if (this.monitor) {
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
            this.renderer.resumeLayers();

            let render = () => {
                if (this.running) {
                    if (this.stats) {
                        this.stats.begin();
                    }
                    this.updateRuntime();

                    this.beatKeeper.updateSpeeds(this.diff, this.config.ControlSettings.tempo);

                    if (this.beatKeeper.getSpeed('sixteen').starting()) {
                        this.doNotDisplay = false;

                    } else if (this.config.DisplaySettings.fps < 46) {
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

                    if (this.config.DisplaySettings.fps < 60) {
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
            this.duration = 1000 / this.config.DisplaySettings.fps;
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
                this.fullReset(true);

                if (IS_MONITOR) {
                    this.monitor = new HC.Monitor();
                    this.monitor.init(this.config, () => {
                        this.displayManager.updateDisplay(0);
                        new HC.Animation.ResizeListener().init(this.displayManager);
                        this.updatePlay();
                    });
                } else {
                    new HC.Animation.ResizeListener().init(this.displayManager);
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
            this.displayManager.resize(this.renderer.getResolution());
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

            let layerIndex = layer;
            layer = this.renderer.layers[layer];

            let updated = this.settingsManager.updateData(layer, data);
            let property;
            let value;
            if (isArray(updated)) {
                property = updated[0].property;
                value = updated[0].value;
            }

            switch (property) {
                case 'shaders':
                    this.listener.fireEventId(EVENT_LAYER_UPDATE_SHADERS, layer.index, layer, FIVE_FPS);
                    break;

                case 'shape_vertices':
                    if (display) {
                        this.listener.fireEventId(EVENT_LAYER_RESET_SHAPES, layer.index, layer, FIVE_FPS);
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
                            if (this.renderer) {
                                if (force) {
                                    console.log('full reset');
                                    assetman.disposeAll();
                                    this.beatKeeper.reset();
                                    this.fullReset(false);

                                } else {
                                    console.log('layer reset');
                                    assetman.disposeAll();
                                    this.renderer.resetLayer(this.renderer.currentLayer);
                                }
                            }
                            this.updateControl('reset', false, false, true, false);
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
                        if (!this.monitor) {
                            break;
                        }
                    case 'play':
                        this.updatePlay();
                        break;

                    case 'audio':
                        if (!this.monitor) {
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
                    if (this.monitor) {
                        this.sourceManager.loadSample(numberExtract(item, 'sample'), value);
                    }
                    this.updateSource(item, false, false, true, false);

                } else if (item.match(/^sample\d+_/)) {
                    this.sourceManager.updateSample(numberExtract(item, 'sample'));

                    if (item.match(/sample\d+_(enabled|record)/)) { // never let samples be selected on enabled/record status change
                        this.listener.fireEvent(EVENT_SAMPLE_STATUS_CHANGED, this.sourceManager.getSample(numberExtract(item, 'sample')));
                    }

                } else if (item.match(/display\d+_source/)) {
                    let display = this.displayManager.getDisplay(numberExtract(item, 'display'));
                    this.sourceManager.updateSource(display);

                    // if (display && display.isFixedSize()) { // todo what is it? needed by light display source make lighting manage it!
                    //     this.displayManager.updateDisplay(display.index, false);
                    // }

                } else if (item.match(/display\d+_sequence/)) {
                    this.sourceManager.updateSource(this.displayManager.getDisplay(numberExtract(item, 'display')));
                }
            }

            this.listener.fireEvent(EVENT_SOURCE_SETTING_CHANGED, arguments);
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
            if (this.listener && data.command === 'message') {
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
                            this.fullReset(true);
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

                    let i = numberExtract(item, 'display');

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
                this.renderer.resetLayer(layer);

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
         */
        doShuffle() {
            let plugin = this.getShuffleModePlugin(this.config.ControlSettings.shuffle_mode);
            let result = plugin.apply();
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
                this.plugins[name] = new HC.shuffle_mode[name](this, this.config.ControlSettings);
            }

            return this.plugins[name];
        }
    }
}
