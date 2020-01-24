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
         *
         * @param config
         */
        constructor(config) {
            this.perspectives = new Array(3);
            this.samples = config.sample;
            this.sequences = config.sequence;
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

                let type = statics.SourceSettings[display.id + '_source'];
                let sq;
                switch (type) {

                    case 'animation':
                    default:
                        source = new HC.Source(renderer, renderer.resolution.x, renderer.resolution.y);
                        break;

                    case 'sequence':
                        sq = statics.SourceSettings[display.id + '_sequence'];
                        source = new HC.Source(this.getSequence(sq), display.width(), display.height());
                        this.updateSequence(sq);
                        break;

                    case 'perspective':
                        sq = statics.SourceSettings[display.id + '_sequence'];
                        source = new HC.Source(this.getPerspective(sq), display.width(), display.height());
                        this.updatePerspective(sq);
                        break;

                    case 'display':
                        sq = statics.SourceSettings[display.id + '_sequence'];
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
                this.sequences[i] = new HC.Sequence(i);
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
                let smp = (statics.SourceSettings[sequence.id + '_input']);
                let os = (override ? false : sequence.sample);
                sequence.sample = this.getSample(smp);

                if (sequence.sample) {

                    let _indicator = function (sequence) {
                        let type = [0, 0, 1];
                        if (sequence.sample) {
                            type[1] = sequence.sample.last();
                            type[2] = round(sequence.sample.last() / 50, 0);
                        }
                        let conf = {SourceTypes: {}};
                        conf.SourceTypes[getSequenceStartKey(sequence.index)] = type;
                        conf.SourceTypes[getSequenceEndKey(sequence.index)] = type;
                        messaging.emitData(sequence.sample.id, conf);

                        animation.updateSource(getSequenceStartKey(sequence.index), 0, false, true);
                        animation.updateSource(getSequenceEndKey(sequence.index), type[1], false, true);
                    };

                    if (os != sequence.sample) {
                        _indicator(sequence);
                    }
                }
                this.updateSample(smp);

                let overlay = parseInt(statics.SourceSettings[sequence.id + '_overlay']);
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

                let iKeys = Object.keys(statics.SourceValues.input);
                let sample = false;
                if (i < statics.SourceValues.sample.length) {
                    sample = new HC.Sample(i);

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

            listener.register('sample.init.start', sample.id, function (target) {
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', 'yellow');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'style', '');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', 'initializing');
                messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], {delay: 50});

                let conf = {DataSettings: {}};
                conf.DataSettings[target.id] = false;
                messaging.emitData(target.id, conf);
            });

            listener.register('sample.init.progress', sample.id, function (target) {
                let progress = target.pointer / target.frameCount * 100;
                let msg = 'preparing';
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', msg);
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-progress', progress);
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', 'yellow');
            });

            listener.register('sample.init.reset', sample.id, function (target) {
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', '');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'style', '');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', '');
                messaging.emitMidi('off', MIDI_ROW_ONE[target.index]);
                messaging.emitMidi('off', MIDI_SAMPLE_FEEDBACK);

                let conf = {DataSettings: {}};
                conf.DataSettings[target.id] = false;
                messaging.emitData(target.id, conf);
            });

            listener.register('sample.init.end', sample.id, function (target) {
                animation.powersave = false;
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', 'green');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'style', '');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', 'ready to record');
                messaging.emitMidi('off', MIDI_ROW_ONE[target.index]);
                messaging.emitMidi('off', MIDI_SAMPLE_FEEDBACK);
                let conf = {DataSettings: {}};
                conf.DataSettings[target.id] = false;
                messaging.emitData(target.id, conf);
            });

            listener.register('sample.render.start', sample.id, function (target) {
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', 'red');
                messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], {timeout: beatKeeper.getSpeed('eight').duration});
                messaging.emitMidi('glow', MIDI_SAMPLE_FEEDBACK);
            });

            listener.register('sample.render.progress', sample.id, function (target) {

                let progress = target.counter / target.beats * 100;

                let msg = 'recording' + ' (' + animation.fps + 'fps)';
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', msg);
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-progress', progress);
                let conf = {
                    timeout: beatKeeper.getSpeed('eight').duration,
                    times: 2
                };
                messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], conf);
            });

            listener.register('sample.render.error', sample.id, function (target) {
                animation.powersave = false;
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-progress', '');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-color', 'red');
                messaging.emitAttr('[id="' + thumbKey + '"]', 'data-label', '[ERROR!]');
                messaging.emitMidi('glow', MIDI_ROW_ONE[sample.index], {timeout: 500, times: 3});
                messaging.emitMidi('glow', MIDI_SAMPLE_FEEDBACK, {timeout: 500, times: 3});
            });

            listener.register('sample.render.end', sample.id, function (target) {
                animation.powersave = false;

                let recordKey = getSampleRecordKey(target.index);

                if (statics.SourceSettings[recordKey]) { // sample
                    animation.updateSource(recordKey, false, true, true, false);

                }

                // if (IS_ANIMATION) {
                let resolution = 630 / target.width;
                sourceman.storeSample(target.index, target.id, resolution, true);
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
                sample.update(statics.ControlSettings.tempo, this.width, this.height);

                if (!sample.enabled && sample instanceof HC.Sample) {
                    sample.reset();

                    let warn = false;
                    if (sample.index < statics.SourceValues.sample.length) {
                        for (let s = 0; s < this.sequences.length; s++) {
                            let seq = this.getSequence(s);
                            if (seq && seq.sample == sample) { // reset input to off if sample was disabled
                                // animation.updateSource(getSequenceSampleKey(s), 'off', true, true, false);
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
                let callback = function () {

                    messaging._emit({action: 'unlinkall', dir: dir}, function (files) {
                        console.log('unlinkall', dir, files.length + ' files deleted');

                        listener.register('sample.store.progress', sample.id, function (target) {
                            let key = getSampleStoreKey(target.index);
                            messaging.emitAttr('[data-id="' + key + '"]', 'data-label', target.pointer + '/' + target.frames.length);
                            messaging.emitAttr('[data-id="' + key + '"]', 'data-color', 'red');
                        });
                        listener.register('sample.store.end', sample.id, function (target) {
                            let key = getSampleStoreKey(target.index);
                            messaging.emitAttr('[data-id="' + key + '"]', 'data-label', '');
                            messaging.emitAttr('[data-id="' + key + '"]', 'data-color', '');

                            if (load) {
                                animation.updateSource(getSampleLoadKey(sample.index), sample.id, false, true, false);
                            }
                        });
                        storeSample(sample, name, resolution);
                    });
                };

                messaging.files(dir, callback);

            }
        }

        /**
         *
         */
        loadSample(i, name) {
            let sample = this.getSample(i);
            if (sample) {
                listener.register('sample.load.progress', sample.id, function (target) {
                    let key = getSampleLoadKey(i);
                    messaging.emitAttr('[data-id="' + key + '"]', 'data-label', target.pointer + '/' + target.frames.length);
                    messaging.emitAttr('[data-id="' + key + '"]', 'data-color', 'red');
                });
                listener.register('sample.load.end', sample.id, function (target) {
                    let key = getSampleLoadKey(i);
                    messaging.emitAttr('[data-id="' + key + '"]', 'data-label', '');
                    messaging.emitAttr('[data-id="' + key + '"]', 'data-color', '');
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
            return displayman.getDisplay(i);
        }

        /**
         *
         * @param i
         * @returns {HC.Color}
         */
        getColor(i) {
            if (!this.colors[i]) {
                this.colors[i] = new HC.Color(i);
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
                this.lighting = new HC.Lighting(i);
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
                this.perspectives[i] = new HC.Perspective(i);
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
            for (let i = 0; i < displayman.displays.length; i++) {
                this.updateSource(displayman.getDisplay(i));
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
            for (let i = 0; i < displayman.displays.length; i++) {
                let dsp = displayman.displays[i];
                if (dsp && dsp.visible && getDisplaySource(i) == 'perspective') {
                    this.getPerspective(getDisplaySequence(i)).next();
                }
            }
        }

        /**
         *
         * @param progress
         */
        renderSamples() {
            let speed = beatKeeper.getDefaultSpeed();
            for (let i = 0; i < this.samples.length; i++) {
                let sample = this.samples[i];
                if (sample && sample.record && sample.enabled && sample.initialized && !sample.complete) {
                    sample.render(renderer.current(), speed, renderer.currentColor());
                }
            }
        }
    }
}
