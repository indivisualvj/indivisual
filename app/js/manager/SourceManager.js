/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import {EventManager} from "./EventManager";
import {Clip, Sample} from "../shared/Sample";
import {Messaging} from "../shared/Messaging";

class SourceManager {
    /**
     * @type {Animation}
     */
    animation;

    /**
     * @type {DisplayManager}
     */
    displayManager;

    /**
     * @type {BeatKeeper}
     */
    beatKeeper;

    /**
     * @type {Renderer}
     */
    renderer;

    /**
     * @type {Config}
     */
    config;

    /**
     * @type {Worker}
     */
    storeWorker;

    /**
     * @type {Worker}
     */
    loadWorker;

    /**
     *
     * @type {Object.<string, SourceManager.DisplaySourcePlugin>}
     */
    plugins = {};

    /**
     * @param {null|Animation} animation
     * @param options
     */
    constructor(animation, options) {
        this.animation = animation;
        if (animation) {
            this.displayManager = animation.displayManager;
            this.beatKeeper = animation.beatKeeper;
            this.renderer = animation.renderer;
        }
        this.config = options.config;
        this.samples = options.sample;

        this.initPlugins();

        this.storeWorker = new Worker('worker/store-sample.worker.js');
        this.loadWorker = new Worker('worker/load-sample.worker.js');
    }

    /**
     *
     */
    initPlugins() {
        for (let p in HC.SourceManager.display_source) {
            HC.SourceManager.display_source[p].initListeners(this, EventManager);
        }
    }

    /**
     * @param type
     * @param index
     * @returns {SourceManager.DisplaySourcePlugin}
     */
    getSourcePlugin(type, index) {

        if (!(type in this.plugins)) {
            this.plugins[type] = {};
        }

        let plugin;
        if (!(index in this.plugins[type])) {
            plugin = new HC.SourceManager.display_source[type](this.animation);
            plugin.init(index);

        } else {
            plugin = this.plugins[type][index];
        }

        if (plugin.cacheable) {
            this.plugins[type][index] = plugin;
        }
        plugin = plugin.getThis(); // returns null if there is no source to render on (e.g. offline)

        return plugin;
    }

    /**
     *
     * @param type
     * @returns {Object<string, SourceManager.DisplaySourcePlugin>}
     */
    getPluginInstances(type) {
        if (!(type in this.plugins)) {
            return {};
        }

        return this.plugins[type];
    }

    /**
     *
     * @param display
     * @returns {boolean}
     */
    getSource(display) {

        let plugin = false;
        if (display) {
            let type = this.config.SourceSettings[display.id + '_source'];
            let index = this.config.SourceSettings[display.id + '_sequence'];

            plugin = this.getSourcePlugin(type, index);
            if (plugin) {
                display.offline = false;
                display.canvas.style.display = 'block';

                plugin.update(this.displayManager.width, this.displayManager.height);

            } else {
                display.offline = true;
                display.canvas.style.display = 'none';
            }
        }

        return plugin;
    }

    /**
     *
     * @param display
     */
    updateSource(display) {
        if (display) {
            display.setSource(this.getSource(display));
        }
    }

    /**
     *
     * @param i
     * @returns {SourceManager.DisplaySourcePlugin}
     */
    getSequence(i) {
        if (i instanceof HC.SourceManager.DisplaySourcePlugin) {
            return i;
        }

        return this.getSourcePlugin('sequence', i);
    }

    /**
     *
     * @param i
     * @returns {*|Sample}
     */
    getSample(i) {
        if (!this.samples[i]) {

            let sample = false;
            if (i < this.config.SourceValues.sample.length) {
                sample = new Sample(this.animation, i);

            } else {
                return;
            }

            if (!sample) {
                return;
            }

            this.samples[i] = sample;

            this.initSampleEvents(sample);
        }

        return this.samples[i];
    }

    /**
     *
     * @param sample
     */
    initSampleEvents(sample) {

        if (IS_PREVIEW) {
            return;
        }

        EventManager.register(EVENT_SAMPLE_INIT_END, sample.id, (target) => {
            Messaging.emitAttr('[id="' + target.id + '"]', 'style', '');
            Messaging.emitAttr('[id="' + target.id + '"]', 'data-label', 'enabled');
            Messaging.emitMidi('off', MIDI_ROW_ONE[target.index]);
            Messaging.emitMidi('off', MIDI_SAMPLE_FEEDBACK);
        });

        EventManager.register(EVENT_SAMPLE_RENDER_START, sample.id, (target) => {
            Messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], {timeout: this.beatKeeper.getSpeed('eight').duration});
            Messaging.emitMidi('glow', MIDI_SAMPLE_FEEDBACK);
        });

        EventManager.register(EVENT_SAMPLE_RENDER_PROGRESS, sample.id, (target) => {

            let progress = target.counter / target.beats * 100;

            let msg = 'recording' + ' (' + this.animation.fps + 'fps)';
            Messaging.emitAttr('[id="' + target.id + '"]', 'data-label', msg);
            Messaging.emitAttr('[id="' + target.id + '"]', 'data-progress', progress);
            let conf = {
                timeout: this.beatKeeper.getSpeed('eight').duration,
                times: 2
            };
            Messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], conf);
        });

        EventManager.register(EVENT_SAMPLE_RENDER_ERROR, sample.id, (target) => {
            Messaging.emitAttr('[id="' + target.id + '"]', 'data-progress', '');
            Messaging.emitAttr('[id="' + target.id + '"]', 'data-label', '[!ERROR]');
            Messaging.emitMidi('glow', MIDI_ROW_ONE[sample.index], {timeout: 500, times: 3});
            Messaging.emitMidi('glow', MIDI_SAMPLE_FEEDBACK, {timeout: 500, times: 3});
        });

        EventManager.register(EVENT_SAMPLE_RENDER_END, sample.id, (target) => {
            let recordKey = getSampleRecordKey(target.index);

            this.animation.updateSource(recordKey, false, true, true, false);
            let scale = 320 / target.canvas.width;
            this.storeSample(target.index, target.id, scale);

            Messaging.emitAttr('[id="' + target.id + '"]', 'data-progress', '');
            Messaging.emitAttr('[id="' + target.id + '"]', 'data-label', 'loading thumbs');
            Messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], {delay: 50});
            Messaging.emitMidi('off', MIDI_SAMPLE_FEEDBACK);
        });

        EventManager.register(EVENT_SAMPLE_STATUS_CHANGED, sample.id, (target) => {
            if (!target.enabled) {
                Messaging.emitAttr('[id="' + target.id + '"]', 'data-progress', '');
                Messaging.emitAttr('[id="' + target.id + '"]', 'data-label', '');
            }
        });
    }

    /**
     *
     * @param i
     */
    updateSample(i) {
        let sample = this.getSample(i);
        if (sample) {
            sample.update(this.config.ControlSettings.tempo, this.displayManager.width, this.displayManager.height);

            if (!sample.enabled) {
                let warn = false;
                if (sample.index < this.config.SourceValues.sample.length) {
                    let plugins = this.getPluginInstances('sequence');
                    for (let s in plugins) {
                        let seq = plugins[s];
                        if (seq && seq.sample === sample) { // reset input to off if sample was disabled
                            warn = true;
                        }
                    }

                    if (warn) {
                        Messaging.emitMidi('glow', MIDI_SAMPLE_FEEDBACK, {timeout: 50, times: 5});
                    }
                }
            }
        }
    }

    /**
     *
     * @param i
     * @param name
     * @param scale
     */
    storeSample(i, name, scale) {

        if (IS_PREVIEW) {
            return;
        }

        let sample = this.getSample(i);
        if (sample) {
            let dir = HC.filePath(SAMPLE_DIR, name);
            let callback = () => {
                Messaging._emit({action: 'unlinkall', dir: dir}, (files) => {
                    console.log('unlinkall', dir, files.length + ' files deleted');

                    EventManager.register(ENENT_SAMPLE_STORE_END, sample.id, (target) => {
                        let key = getSampleStoreKey(target.index);
                        Messaging.emitAttr('[data-id="' + key + '"]', 'data-label', '');

                        if (IS_ANIMATION) { // forward load sample to preview
                            this.animation.updateSource(getSampleLoadKey(sample.index), sample.id, false, true, false);
                        }
                    });
                    this._storeSample(sample, name, scale);
                });
            };

            Messaging.samples(dir, callback);

        }
    }

    /**
     *
     * @param sample
     * @param name
     * @param scale
     * @private
     */
    _storeSample(sample, name, scale) {

        // sample.complete = false;

        this.storeWorker.onmessage = (ev) => {
            if (ev.data.id === sample.id) {
                // sample.complete = true;
                this.storeWorker.onmessage = null;
                sample.samples = ev.data.samples;
                EventManager.fireEventId(ENENT_SAMPLE_STORE_END, sample.id, sample);
            }
        };
        this.storeWorker.postMessage({
            length: sample.frameCount,
            samples: sample.samples,
            path: HC.filePath(SAMPLE_DIR, name),
            scale: scale,
            id: sample.id
        }, sample.samples);
    }

    /**
     *
     */
    loadSample(i, name) {
        let sample = this.getSample(i);
        if (sample) {
            this._loadSample(sample, name);
        }
    }

    /**
     *
     * @param sample
     * @param name
     * @private
     */
    _loadSample(sample, name) {
        sample.width = this.displayManager.width;
        sample.height = this.displayManager.height;

        let file = HC.filePath(SAMPLE_DIR, name);

        Messaging._emit({action: 'samples', file: file}, (files) => {

            let frameCount = files.length;
            sample.enabled = true;
            sample.initialized = true;
            sample.duration = Math.ceil(60000 / this.config.ControlSettings.tempo);
            sample.beats = Math.ceil((frameCount / 60) * 1000 / sample.duration);
            sample.frameCount = frameCount;
            let blobs = [];

            let _proceed = () => {
                this.loadWorker.onmessage = (ev) => {
                    if (ev.data.id === sample.id) {
                        this.loadWorker.onmessage = null;
                        sample.samples = ev.data.blobs;
                        sample.pointer = sample.frameCount;
                        sample.finish();// fixme: preview does not listen
                    }
                };
                this.loadWorker.postMessage({
                    length: sample.frameCount,
                    files: files,
                    path: HC.filePath(SAMPLE_DIR, name),
                    id: sample.id,
                    blobs: blobs
                }, blobs);
            };

            for (let i = 0; i < frameCount; i++) {
                createImageBitmap(new ImageData(sample.width, sample.height)).then((img) => {
                    blobs.push(img);
                    if (i === frameCount-1) {
                        _proceed()
                    }
                });
            }
        });
    }

    /**
     *
     * @param sample
     * @param callback
     */
    loadClip(sample, callback) {
        if (!sample.getClip()) {
            let clip = new Clip(sample.id);
            sample.setClip(clip);

            let file = HC.filePath(SAMPLE_DIR, sample.id);

            Messaging.samples(file, (files) => {

                let loaded = 0;
                let frameCount = files.length;
                let step = frameCount / 16;
                let seconds = frameCount / 60;
                clip.length = frameCount;
                clip.duration = Math.ceil(60000 / sample.config.ControlSettings.tempo);
                clip.beats = Math.ceil(seconds * 1000 / clip.duration);

                let index = 0;

                for (let i = 0; i < frameCount; i += step) {
                    let ri = Math.floor(i);
                    let file = files[ri];
                    file = HC.filePath(SAMPLE_DIR, sample.id, ri + '.png');
                    let image = new Image();
                    image.src = file;
                    image._index = index++;

                    clip.thumbs[image._index] = image;

                    image.onload = () => {
                        loaded += step; // see if next will bee too much
                        if (loaded >= frameCount) {
                            clip.ready = true;
                            callback(clip);
                        }
                    };
                }
            });
        }
    }

    /**
     *
     */
    updateSources() {
        for (let i = 0; i < this.displayManager.displays.length; i++) {
            this.updateSource(this.displayManager.getDisplay(i));
        }
    }

    /**
     *
     * @param type
     * @param index
     */
    updatePluginNr(type, index) {
        let plugin = this.getPluginNrInstance(type, index);

        plugin.update(this.displayManager.width, this.displayManager.height)
    }

    /**
     *
     * @param type
     * @param index
     */
    updatePluginNrSource(type, index) {
        let plugin = this.getPluginNrInstance(type, index);

        plugin.updateSource();
    }

    /**
     *
     * @param type
     * @param index
     * @returns {SourceManager.DisplaySourcePlugin}
     */
    getPluginNrInstance(type, index) {
        let plugins = this.getPluginInstances(type);
        let plugin;
        if (index in plugins) {
            plugin = plugins[index];

        } else {
            plugin = this.getSourcePlugin(type, index);
        }

        return plugin;
    }

    /**
     *
     */
    render() {
        EventManager.fireEvent(EVENT_SOURCE_MANAGER_RENDER, this);
    }

    /**
     * This is used for UI only
     * @param i
     * @returns {boolean}
     */
    getSequenceHasParent(i) {
        let override = this.config.SourceValues.override_material_input[this.config.SourceSettings.override_material_input];
        let key = getSequenceKey(i);
        if (override === key && this.renderer) {
            return true;
        }
        override = this.config.SourceValues.override_background_mode[this.config.SourceSettings.override_background_mode];
        key = getSequenceKey(i);
        if (override === key && this.renderer) {
            return true;
        }

        for (let dpl = 0; dpl < this.config.DisplayValues.display.length; dpl++) {
            let visible = this.getDisplayVisible(dpl);
            if (visible) {
                let src = this.getDisplaySource(dpl);
                if (src === 'sequence') {
                    let seq = this.getDisplaySequence(dpl);
                    if (seq === i) {
                        return true;
                    }
                    let ovrly = this.getSequenceOverlay(seq);
                    if (ovrly === i) {
                        return true;
                    }

                    ovrly = this.getSequenceOverlay(ovrly);
                    if (ovrly === i) {
                        return true;
                    }

                    ovrly = this.getSequenceOverlay(ovrly);
                    if (ovrly === i) {
                        return true;
                    }
                }
            }
        }

        return false;
    }


    /**
     *
     * @param i
     * @returns {string}
     */
    getSequenceOverlayKey(i) {
        return getSequenceKey(i) + '_overlay';
    }

    /**
     *
     * @param i
     * @returns {*}
     */
    getSequenceOverlay(i) {
        let key = this.getSequenceOverlayKey(i);
        if (key in this.config.SourceSettings) {
            let value = this.config.SourceSettings[key];
            return parseInt(value);
        }

        return false;
    }


    /**
     *
     * @param i
     * @returns {*}
     */
    getDisplaySequence(i) {
        let key = getDisplaySequenceKey(i);
        return this.config.SourceSettings[key];
    }


    /**
     *
     * @param i
     * @returns {*}
     */
    getDisplaySource(i) {
        let key = getDisplaySourceKey(i);
        return this.config.SourceSettings[key];
    }


    /**
     *
     * @param i
     * @returns {*}
     */
    getDisplayVisible(i) {
        let key = getDisplayVisibleKey(i);
        return this.config.DisplaySettings[key];
    }


    /**
     *
     * @param i
     * @returns {*}
     */
    getSampleEnabledBySequence(i) {
        let s = this.getSampleBySequence(i);
        return this.getSampleEnabledBySample(s);
    }


    /**
     *
     * @param i
     * @returns {*}
     */
    getSampleEnabledBySample(i) {
        let key = getSampleEnabledKey(i);
        if (key in this.config.SourceSettings) {
            return this.config.SourceSettings[key];
        }

        return false;
    }

    /**
     *
     * @param i
     * @returns {*}
     */
    getSampleBySequence(i) {
        let key = getSequenceSampleKey(i);
        if (key in this.config.SourceSettings) {
            return this.config.SourceSettings[key];
        }

        return false;
    }

}

export {SourceManager}