/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {Program} from "../shared/Program";
import {AudioManager} from "../manager/AudioManager";
import {AudioAnalyser} from "./AudioAnalyser";
import {AssetManager} from "../manager/AssetManager";
import {BeatKeeper} from "../shared/BeatKeeper";
import {LayeredControlSetManager} from "../manager/LayeredControlSetManager";
import {Renderer} from "./Renderer";
import {DisplayManager} from "../manager/DisplayManager";
import {SourceManager} from "../manager/SourceManager";
import {EventManager} from "../manager/EventManager";
import {Messaging} from "../shared/Messaging";
import {PreviewManager} from "../manager/PreviewManager";
import {Logger} from "../shared/Logger";
import {Vector2} from "three";
import {Hotkey} from "../shared/Event";

class Animation extends Program {
    /**
     * @type {Renderer}
     */
    renderer;

    /**
     * @type {LayeredControlSetManager}
     */
    settingsManager;

    /**
     * @type {PreviewManager}
     */
    previewManager;


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
     * @param {Config}config
     */
    init(config) {
        this.config = config;
        this.audioManager = new AudioManager(config);
        this.audioAnalyser = new AudioAnalyser(this);
        this.beatKeeper = new BeatKeeper(() => {return this.now;}, config);
        // todo why not hold in config like all the other settings?
        this.settingsManager = new LayeredControlSetManager(config.AnimationValues, config);

        let renderer = new Renderer(this, {
            layers: new Array(config.ControlValues.layers)
        });
        this.renderer = renderer;
        renderer.initLayers(false);

        let displayManager = new DisplayManager(this, {
            display: new Array(config.DisplayValues.display.length)
        });
        this.displayManager = displayManager;
        displayManager.resize(this.getResolution());

        this.sourceManager = new SourceManager(this, {
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
     */
    animate() {

        this._preAnimate();

        EventManager.fireEvent(EVENT_ANIMATION_ANIMATE);


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
                        Messaging.emitLog('peakBPM', detectedSpeed);
                        this.updateControl('tempo', detectedSpeed, true, true);
                    }
                }

                this.autoGain();
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
            Messaging.emitMidi('glow', MIDI_PEAK_FEEDBACK, {timeout: 125});

            EventManager.fireEvent(EVENT_AUDIO_PEAK, this.audioAnalyser);
        }
    }

    /**
     *
     */
    render() {
        EventManager.fireEvent(EVENT_ANIMATION_RENDER);
        if (IS_ANIMATION) {
            this.sourceManager.render();
        }
        this.displayManager.render();
    }

    /**
     *
     */
    updatePlay() {
        if (IS_PREVIEW) {
            this.config.ControlSettings.play = this.config.ControlSettings.preview;
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
        EventManager.fireEvent(EVENT_ANIMATION_PLAY, this);

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
                EventManager.fireEvent(EVENT_ANIMATION_PAUSE, this);
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
    autoGain() {
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
     * @return {string}
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

        let statusData = {};

        if (this.config.ControlSettings.beat) {
            let speed = this.beatKeeper.getDefaultSpeed();
            if (detectedSpeed) {
                Messaging.emitAttr('[data-id="bpm"]', 'data-color', 'green', 'gray', speed.duration*16);
            } else if (this.audioAnalyser.peakReliable) {
                Messaging.emitAttr('[data-id="bpm"]', 'data-color', 'blue', 'gray', speed.duration*16);
            }


            statusData.bpm = this.beatKeeper.bpm;
            statusData.beats = speed.beats;
            statusData.duration = speed.duration.toFixed(0);
            statusData.pitch = this.beatKeeper.speeds.quarter.pitch.toFixed(0);

            if (this.audioManager.isActive()) {
                statusData.input_level = this.audioAnalyser.avgVolume.toFixed(2);
                statusData.peak_bpm = this.audioAnalyser.peakBPM.toFixed(2);
            }

            Messaging.emitMidi('glow', MIDI_BEAT_FEEDBACK, {timeout: 125});
            if (detectedSpeed) {
                Messaging.emitMidi('glow', MIDI_PEAKBPM_FEEDBACK, {timeout: 60 / (detectedSpeed*4) * 1000, times: 8});
            }

            if (this.beatKeeper.getSpeed('half').starting()) {
                for (let i = 0; i < this.config.SourceValues.sequence.length; i++) {
                    let parent = this.sourceManager.getSequenceHasParent(i);
                    let use = this.sourceManager.getSampleBySequence(i);
                    if (parent) {
                        Messaging.emitMidi('glow', MIDI_ROW_TWO[i], {timeout: 125});
                    }
                    if (use !== 'off') {
                        Messaging.emitMidi('glow', MIDI_ROW_ONE[use], {timeout: 125});
                    }
                }
            }
        }


        statusData.rendered_layers = this.renderer.renderedLayers().map(x=>{return x+1}).join('|');

        if (this.stats) {
            statusData.fps = this.fps;
            statusData.rms = this.rmsAverage();
        }

        Messaging.emitData('DataStatus', statusData);
    }

    /**
     *
     */
    loadSession() {

        let callback = (session) => {

            if ('displays' in session) {
                Logger.loading('displays', 'synced');
                let displays = session.displays;
                this.updateDisplays(displays, true, false, true);
            }

            if ('sources' in session) {
                Logger.loading('sources', 'synced');
                let sources = session.sources;
                this.updateSources(sources, true, false, true);
            }

            if ('settings' in session) {
                Logger.loading('settings', 'synced');
                let settings = session.settings;

                for (let k in settings) {
                    this.updateSettings(k, settings[k], true, false, true);
                }
            }

            if ('controls' in session) {
                Logger.loading('controls', 'synced');
                let controls = session.controls;
                this.updateControls(controls, true, false, true);
            }

            this.sourceManager.updateSources();
            this.reset();
            this.initPreview();

            Logger.loading(null, null,250);
        };

        Messaging.sync(callback);
    }

    initPreview() {
        if (IS_PREVIEW) {
            this.previewManager = new PreviewManager();
            this.previewManager.init(this.config, () => {
                this.displayManager.updateDisplay(0);
                this.initResize();
                this.updatePlay();
            });
        }
    }

    /**
     *
     */
    fullReset() {
        EventManager.fireEvent(EVENT_FULL_RESET, this);
    }

    /**
     *
     */
    reset() {
        EventManager.fireEvent(EVENT_RESET, this);
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
                EventManager.fireEventId(EVENT_LAYER_UPDATE_SHADERS, layer, this, SKIP_TEN_FRAMES);
                break;

            case 'shape_vertices':
                if (display) {
                    EventManager.fireEventId(EVENT_LAYER_RESET_SHAPES, layer, this, SKIP_TEN_FRAMES);
                }
                break;
        }

        if (forward === true) {
            Messaging.emitSettings(layer, data, true, false, force);
        }

        EventManager.fireEvent(EVENT_ANIMATION_UPDATE_SETTING, {layer: layer, item: property, value: value});
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
            Messaging.emitControls(data, true, false, force);
        }

        if (display) {
            switch (item) {
                case 'reset':
                    if (value) {

                        if (force) {
                            console.log('full reset');
                            AssetManager.disposeAll();
                            this.beatKeeper.reset();
                            EventManager.fireEvent(EVENT_FULL_RESET, this);

                        } else {
                            console.log('layer reset');
                            AssetManager.disposeAll();
                            EventManager.fireEventId(EVENT_LAYER_RESET, this.config.ControlSettings.layer, this);
                        }
                        this.updateControl('reset', false, false, true, false);
                    }
                    break;

                case 'layer':
                    this.renderer.nextLayer = this.renderer.layers[value];
                    break;

                case 'preview':
                    if (!IS_PREVIEW) {
                        break;
                    }
                case 'play':
                    this.updatePlay();
                    break;

                case 'audio':
                    if (!IS_PREVIEW) {
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
            Messaging.emitSources(data, true, false, force);
        }

        if (display) {
            if (item.match(/^sample\d+_load/) && value) {
                if (IS_PREVIEW) {
                    this.sourceManager.loadSample(numberExtract(item, 'sample'), value);
                }
                this.updateSource(item, false, false, true, false);

            } else if (item.match(/^sample\d+_/)) {
                this.sourceManager.updateSample(numberExtract(item, 'sample'));

                if (item.match(/sample\d+_(enabled|record)/)) { // never let samples be selected on enabled/record status change
                    EventManager.fireEvent(EVENT_SAMPLE_STATUS_CHANGED, this.sourceManager.getSample(numberExtract(item, 'sample')));
                }

            } else if (item.match(/display\d+_source/)) {
                let display = this.displayManager.getDisplay(numberExtract(item, 'display'));
                this.sourceManager.updateSource(display);

            } else if (item.match(/display\d+_sequence/)) {
                this.sourceManager.updateSource(this.displayManager.getDisplay(numberExtract(item, 'display')));
            }
        }

        EventManager.fireEvent(EVENT_SOURCE_SETTING_CHANGED, arguments);
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
                Messaging.emitDisplays(data, true, false, force);
            }

            if (display) {
                switch (item) {
                    case 'resolution':
                        EventManager.fireEvent(EVENT_RESIZE, this);
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
            EventManager.fireEventId(EVENT_LAYER_RESET, layer, this);

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
            this.displayManager.reset(this.getResolution());
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
            this.updateSource(k, value, display, false, force);
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
                resolution = {x: w, y: h, aspect: w / h, diameter: new Vector2(w, h).length()};
            }
        }

        return resolution;
    }

    /**
     *
     */
    initSuperGau() {
        EventManager.register(EVENT_WEBGL_CONTEXT_LOST, this.name, () => {
            // now reset...
            Logger.log('HC.Renderer', 'another context loss...', true, true);

            for (let i = 0; i < this.config.SourceValues.sample.length; i++) {
                this.updateSource(getSampleKey(i), false, true, true, false);
            }
            this.updateSource('override_material_input', 'none', true, true, false);
            this.updateSource('override_background_mode', 'none', true, true, false);

        });
    }
    initEvents() {
        Hotkey.add('space', (e) => {
            this.updateControl('play', !this.config.ControlSettings.play, true, true, false);
        });

        document.onselectstart = function () {
            return false;
        };

        if (IS_ANIMATION) {
            let to;
            document.addEventListener('mousemove', function () {
                document.body.style.cursor = 'default';
                clearTimeout(to);
                to = setTimeout(function () {
                    document.body.style.cursor = 'none';
                }, 2000);
            });

            let inFullscreen = false;
            document.addEventListener('dblclick', () => {
                if (inFullscreen) {
                    document.exitFullscreen();
                    return;
                }

                document.body.requestFullscreen().then(() => {
                    console.log('now in fullscreen');

                }, (e) => {
                    console.error('fullscreen failed', e);

                });
            });
            let wakeLock;

            document.addEventListener('fullscreenchange', (e) => {
                if (!inFullscreen) {
                    inFullscreen = true;
                    navigator.wakeLock.request().then((e) => {
                        wakeLock = e;
                        console.log('wakelock active', e);
                    }, (e) => {
                        console.error('wakelock failed', e);
                    });
                } else if (inFullscreen) {
                    console.log('exit fullscreen');
                    inFullscreen = false;
                    if (wakeLock) {
                        wakeLock.release().then(() => {
                            console.log('wakelock released');
                        });
                    }
                }
            });
        }
    }

    initResize() {

        window.addEventListener('resize', () => {
            for (let i = 0; i < this.displayManager.config.DisplayValues.display.length; i++) {
                let display = this.displayManager.getDisplay(i);
                if (display) {
                    if (!display.getMapping()) {
                        this.displayManager.centerDisplay(i, 1, true, false);
                    }
                }
            }
        });
    }
}

export {Animation}
