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
            this.perspectives = new Array(3);
            this.samples = options.sample;
            this.sequences = options.sequence;
            this.colors = [];
        }

        /**
         *
         * @param display
         * @returns {boolean}
         */
        getSource(display) {

            let source = false;
            if (display) {
                display.canvas.style.display = 'block';
                display.offline = false;

                let type = this.config.SourceSettings[display.id + '_source'];
                let sq;
                switch (type) {

                    case 'animation':
                    default:
                        source = new HC.Source(this.renderer, this.renderer.resolution.x, this.renderer.resolution.y);
                        break;

                    case 'sequence':
                        sq = this.config.SourceSettings[display.id + '_sequence'];
                        source = new HC.Source(this.getSequence(sq), display.width(), display.height());
                        this.updateSequence(sq);
                        break;

                    case 'perspective':
                        sq = this.config.SourceSettings[display.id + '_sequence'];
                        source = new HC.Source(this.getPerspective(sq), display.width(), display.height());
                        this.updatePerspective(sq);
                        break;

                    case 'display':
                        sq = this.config.SourceSettings[display.id + '_sequence'];
                        source = new HC.Source(this.getDisplay(sq), display.width(), display.height());
                        break;

                    case 'black':
                        let co = 0;
                        source = new HC.Source(this.getColor(co), display.width(), display.height());
                        this.updateColor(co);
                        break;

                    case 'lighting':
                        let li = this.getLighting(0);
                        li.update();
                        source = new HC.Source(li, li.width, li.height);
                        break;

                    case 'offline':
                        display.offline = true;
                        display.canvas.style.display = 'none';
                        source = false;
                        break;
                }
            }

            return source;
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
            if (!this.sequences[i]) {
                this.sequences[i] = new HC.Sequence(this.animation, i);
            }

            return this.sequences[i];
        }

        /**
         *
         * @param i
         * @param override
         */
        updateSequence(i, override) {
            let sequence = this.getSequence(i);
            if (sequence) {
                let smp = (this.config.SourceSettings[sequence.id + '_input']);
                let os = (override ? false : sequence.sample);
                sequence.sample = this.getSample(smp);

                if (sequence.sample) {

                    let _indicator = (sequence) => {
                        let type = [0, 0, 1];
                        if (sequence.sample) {
                            type[1] = sequence.sample.last();
                            type[2] = round(sequence.sample.last() / 50, 0);
                        }
                        let conf = {SourceTypes: {}};
                        conf.SourceTypes[getSequenceStartKey(sequence.index)] = type;
                        conf.SourceTypes[getSequenceEndKey(sequence.index)] = type;
                        messaging.emitData(sequence.sample.id, conf);

                        this.animation.updateSource(getSequenceStartKey(sequence.index), 0, false, true);
                        this.animation.updateSource(getSequenceEndKey(sequence.index), type[1], false, true);
                    };

                    if (os != sequence.sample) {
                        _indicator(sequence);
                    }
                }
                this.updateSample(smp);

                let overlay = parseInt(this.config.SourceSettings[sequence.id + '_overlay']);
                if (overlay >= 0) {
                    sequence.overlay = this.getSequence(overlay);

                } else {
                    sequence.overlay = false;
                }

                sequence.update(this.width, this.height);
            }
        }

        /**
         *
         * @param i
         * @returns {*|HC.Sample}
         */
        getSample(i) {
            if (!this.samples[i]) {

                let iKeys = Object.keys(this.config.SourceValues.input);
                let sample = false;
                if (i < this.config.SourceValues.sample.length) {
                    sample = new HC.Sample(this.animation, this.animation.config, i);

                } else {
                    return;
                }

                if (!sample) {
                    return;
                }

                this.samples[i] = sample;

                if (IS_ANIMATION) {
                    this.initSample(sample);
                }
            }

            return this.samples[i];
        }

        /**
         *
         * @param sample
         */
        initSample(sample) {
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
                this.animation.powersave = false;
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
                this.animation.powersave = false;
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-progress', '');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', 'red');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', '[ERROR!]');
                messaging.emitMidi('glow', MIDI_ROW_ONE[sample.index], {timeout: 500, times: 3});
                messaging.emitMidi('glow', MIDI_SAMPLE_FEEDBACK, {timeout: 500, times: 3});
            });

            this.listener.register('sample.render.end', sample.id, (target) => {
                this.animation.powersave = false;

                let recordKey = getSampleRecordKey(target.index);

                if (this.config.SourceSettings[recordKey]) { // sample
                    this.animation.updateSource(recordKey, false, true, true, false);

                }

                // if (IS_ANIMATION) {
                let resolution = 630 / target.width;
                this.storeSample(target.index, target.id, resolution, true);
                // }

                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-progress', '');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', 'yellow');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', 'loading thumbs');
                messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], {delay: 50});
                messaging.emitMidi('off', MIDI_SAMPLE_FEEDBACK);
            });
        }

        /**
         *
         * @param sample
         */
        updateSample(i) {
            let sample = this.getSample(i);
            if (sample) {
                sample.update(this.config.ControlSettings.tempo, this.width, this.height);

                if (!sample.enabled && sample instanceof HC.Sample) {
                    sample.reset();

                    let warn = false;
                    if (sample.index < this.config.SourceValues.sample.length) {
                        for (let s = 0; s < this.sequences.length; s++) {
                            let seq = this.getSequence(s);
                            if (seq && seq.sample == sample) { // reset input to off if sample was disabled
                                warn = true;
                                break;
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
         */
        storeSample(i, name, resolution, load) {
            let sample = this.getSample(i);
            if (sample) {

                let dir = filePath(SAMPLE_DIR, name);
                let callback = () => {

                    messaging._emit({action: 'unlinkall', dir: dir}, (files) => {
                        console.log('unlinkall', dir, files.length + ' files deleted');

                        this.listener.register('sample.store.progress', sample.id, (target) => {
                            let key = getSampleStoreKey(target.index);
                            messaging.emitAttr('[data-id="' + key + '"]', 'data-label', target.pointer + '/' + target.frames.length);
                            messaging.emitAttr('[data-id="' + key + '"]', 'data-color', 'red');
                        });
                        this.listener.register('sample.store.end', sample.id, (target) => {
                            let key = getSampleStoreKey(target.index);
                            messaging.emitAttr('[data-id="' + key + '"]', 'data-label', '');
                            messaging.emitAttr('[data-id="' + key + '"]', 'data-color', '');

                            if (load) {
                                this.animation.updateSource(getSampleLoadKey(sample.index), sample.id, false, true, false);
                            }
                        });
                        this._storeSample(sample, name, resolution);
                    });
                };

                messaging.files(dir, callback);

            }
        }

        /**
         *
         * @param sample
         * @param name
         * @param resolution
         * @private
         */
        _storeSample(sample, name, resolution) {
            sample.pointer = 0;
            let canvas = false;
            let ctx = false;
            if (resolution && resolution != 1.0) {
                canvas = document.createElement('canvas');
                canvas.width = sample.width * resolution;
                canvas.height = sample.height * resolution;
                ctx = canvas.getContext('2d');
            }

            let _mov = () => {

                if (sample.isReady()) {
                    this.animation.powersave = true;

                    let frame = sample.frames[sample.pointer];
                    if (ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(frame, 0, 0, frame.width, frame.height, 0, 0, canvas.width, canvas.height);
                        frame = canvas;
                    }
                    let now = HC.now();
                    let data = frame.toDataURL('image/png');
                    let diff = HC.now() - now;

                    messaging.sample(name, sample.pointer + '.png', data);
                    sample.pointer++;

                    if (sample.pointer % 5 == 0) {
                        this.listener.fireEventId('sample.store.progress', sample.id, sample);
                    }

                    if (sample.pointer < sample.frames.length) {

                        setTimeout(() => {
                            requestAnimationFrame(_mov);
                        }, this.animation.threadTimeout(diff / this.animation.duration));

                    } else {
                        this.animation.powersave = false;
                        this.listener.fireEventId('sample.store.end', sample.id, sample);
                    }
                }
            };
            requestAnimationFrame(_mov);
        }

        /**
         *
         */
        loadSample(i, name) {
            let sample = this.getSample(i);
            if (sample) {
                this.listener.register('sample.load.progress', sample.id, function (target) {
                    // let key = getSampleLoadKey(i);
                    // messaging.emitAttr('[data-id="' + key + '"]', 'data-label', target.pointer + '/' + target.frames.length);
                    // messaging.emitAttr('[data-id="' + key + '"]', 'data-color', 'red');
                });
                this.listener.register('sample.load.end', sample.id, function (target) {
                    // let key = getSampleLoadKey(i);
                    // messaging.emitAttr('[data-id="' + key + '"]', 'data-label', '');
                    // messaging.emitAttr('[data-id="' + key + '"]', 'data-color', '');
                });
                sample.load(name, this.width, this.height);
            }
        }

        /**
         *
         * @param i
         * @returns {*}
         */
        getDisplay(i) {
            return this.displayManager.getDisplay(i);
        }

        /**
         *
         * @param i
         * @returns {HC.Color}
         */
        getColor(i) {
            if (!this.colors[i]) {
                this.colors[i] = new HC.Color(this.animation, i);
            }

            return this.colors[i];
        }

        /**
         *
         * @param i
         * @returns {HC.Lighting|*}
         */
        getLighting(i) {
            if (!this.lighting) {
                this.lighting = new HC.Lighting(this.animation, i);
            }

            return this.lighting;
        }

        /**
         *
         * @param i
         * @returns {*}
         */
        getPerspective(i) {
            if (!this.perspectives[i]) {
                this.perspectives[i] = new HC.Perspective(this.animation, i);
            }

            return this.perspectives[i];
        }

        /**
         *
         * @param i
         */
        updatePerspective(i) {
            let perspective = this.getPerspective(i);
            if (perspective) {
                perspective.update(this.width, this.height);
            }
        }

        /**
         *
         * @param i
         */
        updateColor(i) {
            let color = this.getColor(i);
            if (color) {
                color.update(this.width, this.height);
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
         */
        updateSequences() {
            for (let i = 0; i < this.sequences.length; i++) {
                this.updateSequence(i);
            }
        }

        /**
         *
         * @param resolution
         */
        resize(resolution) {
            this.width = resolution.x;
            this.height = resolution.y;
        }

        /**
         *
         */
        render() {
            this.renderSamples();
        }

        /**
         *
         */
        renderPerspectives() {
            for (let i = 0; i < this.displayManager.displays.length; i++) {
                let dsp = this.displayManager.displays[i];
                if (dsp && dsp.visible && this.getDisplaySource(i) == 'perspective') {
                    this.getPerspective(this.getDisplaySequence(i)).next();
                }
            }
        }

        /**
         *
         * @param progress
         */
        renderSamples() {
            let speed = this.beatKeeper.getDefaultSpeed();
            for (let i = 0; i < this.samples.length; i++) {
                let sample = this.samples[i];
                if (sample && sample.record && sample.enabled && sample.initialized && !sample.complete) {
                    sample.render(this.renderer.current(), speed, this.renderer.currentColor());
                }
            }
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
