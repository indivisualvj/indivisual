/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.SourceManager}
     */
    HC.SourceManager = class SourceManager {

        /**
         * @type {HC.Animation}
         */
        animation;
        
        /**
         * @type {HC.DisplayManager}
         */
        displayManager;

        /**
         * @type {HC.BeatKeeper}
         */
        beatKeeper;

        /**
         * @type {HC.Renderer}
         */
        renderer;

        /**
         * @type {HC.Listener}
         */
        listener;

        /**
         * @type {HC.Config}
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
         * @type {Object.<string, HC.SourceManager.DisplaySourcePlugin>}
         */
        plugins = {};

        /**
         * @param {HC.Animation} animation
         * @param options
         */
        constructor(animation, options) {
            this.animation = animation;
            if (animation) {
                this.displayManager = animation.displayManager;
                this.beatKeeper = animation.beatKeeper;
                this.renderer = animation.renderer;
                this.listener = animation.listener;
            }
            this.config = options.config;
            this.samples = options.sample;

            this.initPlugins();

            this.storeWorker = new Worker('worker/store-worker.js');
            this.loadWorker = new Worker('worker/load-worker.js');
        }

        /**
         *
         */
        initPlugins() {
            for (let p in HC.SourceManager.display_source) {
                HC.SourceManager.display_source[p].initListeners(this);
            }
        }

        /**
         * @param type
         * @param index
         * @returns {HC.SourceManager.DisplaySourcePlugin}
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
         * @returns {Object<string, HC.SourceManager.DisplaySourcePlugin>}
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
         * @returns {*}
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
         * @returns {*|HC.Sample}
         */
        getSample(i) {
            if (!this.samples[i]) {

                let sample = false;
                if (i < this.config.SourceValues.sample.length) {
                    sample = new HC.Sample(this.animation, i);

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

            if (IS_MONITOR) {
                return;
            }

            let thumbKey = getSampleThumbKey(sample.index);

            this.listener.register('sample.init.start', sample.id, function (target) {
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', 'yellow');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'style', '');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', 'initializing');
                messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], {delay: 50});

                let conf = {DataSettings: {}};
                conf.DataSettings[target.id] = false;
                messaging.emitData(target.id, conf);
            });

            this.listener.register('sample.init.progress', sample.id, function (target) {
                let progress = target.pointer / target.frameCount * 100;
                let msg = 'preparing';
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', msg);
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-progress', progress);
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', 'yellow');
            });

            this.listener.register('sample.init.reset', sample.id, function (target) {
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', '');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'style', '');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', '');
                messaging.emitMidi('off', MIDI_ROW_ONE[target.index]);
                messaging.emitMidi('off', MIDI_SAMPLE_FEEDBACK);

                let conf = {DataSettings: {}};
                conf.DataSettings[target.id] = false;
                messaging.emitData(target.id, conf);
            });

            this.listener.register('sample.init.end', sample.id, (target) => {
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', 'green');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'style', '');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', 'ready to record');
                messaging.emitMidi('off', MIDI_ROW_ONE[target.index]);
                messaging.emitMidi('off', MIDI_SAMPLE_FEEDBACK);
                let conf = {DataSettings: {}};
                conf.DataSettings[target.id] = false;
                messaging.emitData(target.id, conf);
            });

            this.listener.register('sample.render.start', sample.id, (target) => {
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', 'red');
                messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], {timeout: this.beatKeeper.getSpeed('eight').duration});
                messaging.emitMidi('glow', MIDI_SAMPLE_FEEDBACK);
            });

            this.listener.register('sample.render.progress', sample.id, (target) => {

                let progress = target.counter / target.beats * 100;

                let msg = 'recording' + ' (' + this.animation.fps + 'fps)';
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', msg);
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-progress', progress);
                let conf = {
                    timeout: this.beatKeeper.getSpeed('eight').duration,
                    times: 2
                };
                messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], conf);
            });

            this.listener.register('sample.render.error', sample.id, (target) => {
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-progress', '');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', 'red');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', '[ERROR!]');
                messaging.emitMidi('glow', MIDI_ROW_ONE[sample.index], {timeout: 500, times: 3});
                messaging.emitMidi('glow', MIDI_SAMPLE_FEEDBACK, {timeout: 500, times: 3});
            });

            this.listener.register('sample.render.end', sample.id, (target) => {
                let recordKey = getSampleRecordKey(target.index);

                if (this.config.SourceSettings[recordKey]) { // reset smpX_record
                    this.animation.updateSource(recordKey, false, true, true, false);
                }

                let scale = 320 / target.width;
                this.storeSample(target.index, target.id, scale);

                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-progress', '');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', 'yellow');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', 'loading thumbs');
                messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], {delay: 50});
                messaging.emitMidi('off', MIDI_SAMPLE_FEEDBACK);
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
                            if (seq && seq.sample == sample) { // reset input to off if sample was disabled
                                warn = true;
                            }
                        }

                        if (warn) {
                            messaging.emitMidi('glow', MIDI_SAMPLE_FEEDBACK, {timeout: 50, times: 5});
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

            if (IS_MONITOR) {
                return;
            }

            let sample = this.getSample(i);
            if (sample) {
                let dir = filePath(SAMPLE_DIR, name);
                let callback = () => {
                    messaging._emit({action: 'unlinkall', dir: dir}, (files) => {
                        console.log('unlinkall', dir, files.length + ' files deleted');

                        this.listener.register('sample.store.progress', sample.id, (target) => {
                            let key = getSampleStoreKey(target.index);
                            messaging.emitAttr('[data-id="' + key + '"]', 'data-label', target.pointer + '/' + target.frameCount);
                            messaging.emitAttr('[data-id="' + key + '"]', 'data-color', 'red');
                        });
                        this.listener.register('sample.store.end', sample.id, (target) => {
                            let key = getSampleStoreKey(target.index);
                            messaging.emitAttr('[data-id="' + key + '"]', 'data-label', '');
                            messaging.emitAttr('[data-id="' + key + '"]', 'data-color', '');

                            if (IS_ANIMATION) { // forward load sample to monitor
                                this.animation.updateSource(getSampleLoadKey(sample.index), sample.id, false, true, false);
                            }
                        });
                        this._storeSample(sample, name, scale);
                    });
                };

                messaging.files(dir, callback);

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
                    sample.samples = ev.data.frames;
                    this.listener.fireEventId('sample.store.end', sample.id, sample);
                }
            };
            this.storeWorker.postMessage({
                length: sample.frameCount,
                frames: sample.samples,
                path: filePath(SAMPLE_DIR, name),
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

            let file = filePath(SAMPLE_DIR, name);

            messaging._emit({action: 'files', file: file}, (files) => {

                let frameCount = files.length;
                sample.enabled = true;
                sample.initialized = true;
                sample.duration = Math.ceil(60000 / this.config.ControlSettings.tempo);
                sample.beats = Math.ceil((frameCount / 60) * 1000 / sample.duration);
                sample.frameCount = frameCount;
                sample.frames = [];
                let blobs = [];
                for (let i = 0; i < frameCount; i++) {
                    blobs.push(new ArrayBuffer(0));
                }

                this.loadWorker.onmessage = (ev) => {
                    if (ev.data.id === sample.id) {
                        this.loadWorker.onmessage = null;
                        let blobs = ev.data.blobs;
                        sample.samples = [];

                        let loaded = 0;
                        for (let i = 0; i < blobs.length; i++) {

                            let blob = blobs[i];
                            let image = new Image();
                            image._index = i;
                            image.onload = () => {

                                let canvas = new OffscreenCanvas(sample.width, sample.height);
                                let ctx = canvas.getContext('2d');

                                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                                let bmp = canvas.transferToImageBitmap();
                                bmp._index = image._index;
                                sample.samples[bmp._index] = bmp;

                                URL.revokeObjectURL(image.src);

                                loaded++;
                                if (loaded >= frameCount) {
                                    sample.pointer = sample.frameCount;
                                    sample.finish();
                                    this.listener.fireEventId(EVENT_SAMPLE_READY, sample);
                                }
                            };

                            let arrayBufferView = new Uint8Array(blob);
                            blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
                            image.src = URL.createObjectURL(blob);
                        }
                    }
                };
                this.loadWorker.postMessage({
                    length: sample.frameCount,
                    files: files,
                    blobs: blobs,
                    path: filePath(SAMPLE_DIR, name),
                    id: sample.id
                }, blobs);
            });
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
            let plugins = this.getPluginInstances(type);
            let plugin;
            if (index in plugins) {
                plugin = plugins[index];

            } else {
                plugin = this.getSourcePlugin(type, index);
            }

            plugin.update(this.displayManager.width, this.displayManager.height)
        }

        /**
         *
         * @param type
         * @param index
         */
        updatePluginNrSource(type, index) {
            let plugins = this.getPluginInstances(type);
            if (index in plugins) {
                plugins[index].updateSource();
            }
        }

        /**
         *
         */
        render() {
            this.listener.fireEvent(EVENT_SOURCE_MANAGER_RENDER);
        }

        /**
         *
         * @param i
         * @returns {boolean}
         */
        getSequenceHasParent(i) {

            let material = this.config.SourceValues.material_map[this.config.SourceSettings.material_map];
            let key = getSequenceKey(i);
            if (material == key && messaging.program.renderer) {
                return true;
            }

            for (let dpl = 0; dpl < this.config.DisplayValues.display.length; dpl++) {
                let visible = this.getDisplayVisible(dpl);
                if (visible) {
                    let src = this.getDisplaySource(dpl);
                    if (src == 'sequence') {
                        let seq = this.getDisplaySequence(dpl);
                        if (seq == i) {
                            return true;
                        }
                        let ovrly = this.getSequenceOverlay(seq);
                        if (ovrly == i) {
                            return true;
                        }

                        ovrly = this.getSequenceOverlay(ovrly);
                        if (ovrly == i) {
                            return true;
                        }

                        ovrly = this.getSequenceOverlay(ovrly);
                        if (ovrly == i) {
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
            let value = this.config.SourceSettings[key];
            return value;
        }


        /**
         *
         * @param i
         * @returns {*}
         */
        getDisplaySource(i) {
            let key = getDisplaySourceKey(i);
            let value = this.config.SourceSettings[key];
            return value;
        }


        /**
         *
         * @param i
         * @returns {*}
         */
        getDisplayVisible(i) {
            let key = getDisplayVisibleKey(i);
            let value = this.config.DisplaySettings[key];
            return value;
        }


        /**
         *
         * @param i
         * @returns {*}
         */
        getSampleEnabledBySequence(i) {
            let s = this.getSampleBySequence(i);
            let value = this.getSampleEnabledBySample(s);

            return value;
        }


        /**
         *
         * @param i
         * @returns {*}
         */
        getSampleEnabledBySample(i) {
            let key = getSampleEnabledKey(i);
            if (key in this.config.SourceSettings) {
                let value = this.config.SourceSettings[key];
                return value;
            }

            return false;
        }


        /**
         *
         * @param i
         * @returns {*}
         */
        getSequenceBySample(i) {
            for (let seq = 0; seq < this.config.SourceValues.sequence.length; seq++) {
                let sample = this.getSampleBySequence(seq);
                if (sample == i) {
                    return seq;
                }
            }

            return false;
        }

        /**
         *
         * @param sequence
         * @param frames
         * @param start
         * @param end
         */
        applySequenceSlice(sequence, frames, start, end) {
            let end2end = frames - end;
            let prc = (frames - end2end) / frames;
            let sp = start;
            let ep = sp + prc * frames;
            let l = ep - sp;
            let ve = sp + l;
            if (ve > frames) {
                sp -= ve - frames;
            }

            sequence.start = Math.min(frames - 1, Math.round(sp));
            sequence.end = Math.min(frames - 1, Math.round(ep));
            sequence.length = sequence.end - sequence.start;
        }

        /**
         *
         * @param i
         * @returns {*}
         */
        getSampleBySequence(i) {
            let key = getSequenceSampleKey(i);
            if (key in this.config.SourceSettings) {
                let value = this.config.SourceSettings[key];

                return value;
            }

            return false;
        }

    }
}
