/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.SourceManager = class SourceManager {

        constructor(config) {
            this.perspectives = new Array(3);
            this.samples = config.sample;
            this.sequences = config.sequence;
            this.videos = config.video;
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

                    case 'video':
                        sq = statics.DisplaySettings[display.id + '_video'];
                        source = new HC.Source(this.getVideo(sq), display.width(), display.height());
                        this.updateVideo(sq);
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

                let ovrly = parseInt(statics.SourceSettings[sequence.id + '_overlay']);
                if (ovrly >= 0) {
                    sequence.overlay = this.getSequence(ovrly);

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

                } else if (i < iKeys.length && i in statics.SourceValues.input) {
                    let file = statics.SourceValues.input[i];

                    if (assetman.getVideo(file)) {
                        let path = filePath(VIDEO_DIR, file);
                        sample = new HC.Video(i, path);

                    } else {
                        let path = filePath(IMAGE_DIR, file);
                        sample = new HC.Image(i, path);
                    }
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
            let enabledKey = getSampleEnabledKey(sample.index);
            let recordKey = getSampleRecordKey(sample.index);

            listener.register('sample.init.start', sample.id, function (target) {
                messaging.emitAttr('[data-id="' + enabledKey + '"]', 'data-color', 'red');
                messaging.emitAttr('[data-id="' + enabledKey + '"]', 'style', '');
                messaging.emitAttr('[data-id="' + enabledKey + '"]', 'data-label', '...');
                messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], {delay: 50});

                let conf = {DataSettings: {}};
                conf.DataSettings[target.id] = false;
                messaging.emitData(target.id, conf);
            });

            listener.register('sample.init.progress', sample.id, function (target) {
                let key = getSampleEnabledKey(sample.index);
                messaging.emitAttr('[data-id="' + key + '"]', 'data-label', target.pointer + '/' + target.frameCount);
                messaging.emitAttr('[data-id="' + key + '"]', 'data-color', 'red');
            });

            listener.register('sample.init.reset', sample.id, function (target) {
                messaging.emitAttr('[data-id="' + enabledKey + '"]', 'data-color', '');
                messaging.emitAttr('[data-id="' + enabledKey + '"]', 'style', '');
                messaging.emitAttr('[data-id="' + enabledKey + '"]', 'data-label', '');
                messaging.emitAttr('[data-id="' + recordKey + '"]', 'data-color', '');
                messaging.emitAttr('[data-id="' + recordKey + '"]', 'style', '');
                messaging.emitAttr('[data-id="' + recordKey + '"]', 'data-label', '');
                messaging.emitMidi('off', MIDI_ROW_ONE[target.index]);
                messaging.emitMidi('off', MIDI_SAMPLE_FEEDBACK);

                let conf = {DataSettings: {}};
                conf.DataSettings[target.id] = false;
                messaging.emitData(target.id, conf);
            });

            listener.register('sample.init.end', sample.id, function (target) {
                animation.powersave = false;
                messaging.emitAttr('[data-id="' + enabledKey + '"]', 'data-color', 'green');
                messaging.emitAttr('[data-id="' + enabledKey + '"]', 'style', '');
                messaging.emitAttr('[data-id="' + enabledKey + '"]', 'data-label', 'ready');
                messaging.emitMidi('off', MIDI_ROW_ONE[target.index]);
                messaging.emitMidi('off', MIDI_SAMPLE_FEEDBACK);
                let conf = {DataSettings: {}};
                conf.DataSettings[target.id] = false;
                messaging.emitData(target.id, conf);
            });

            listener.register('sample.render.start', sample.id, function (target) {
                messaging.emitAttr('[data-id="' + recordKey + '"]', 'data-color', 'red');
                messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], {timeout: beatkeeper.getSpeed('eight').duration});
                messaging.emitMidi('glow', MIDI_SAMPLE_FEEDBACK);
            });

            listener.register('sample.render.progress', sample.id, function (target) {
                messaging.emitAttr('[data-id="' + recordKey + '"]', 'data-label', (target.counter) + ' (' + animation.fps + 'fps)');
                let conf = {
                    timeout: beatkeeper.getSpeed('eight').duration,
                    times: 2
                };
                messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], conf);
            });

            listener.register('sample.render.error', sample.id, function (target) {
                animation.powersave = false;
                messaging.emitAttr('[data-id="' + recordKey + '"]', 'data-color', 'yellow');
                messaging.emitAttr('[data-id="' + recordKey + '"]', 'data-label', '!error');
                messaging.emitMidi('glow', MIDI_ROW_ONE[sample.index], {timeout: 500, times: 3});
                messaging.emitMidi('glow', MIDI_SAMPLE_FEEDBACK, {timeout: 500, times: 3});
            });

            listener.register('sample.render.end', sample.id, function (target) {
                animation.powersave = false;

                let recordKey = getSampleRecordKey(target.index);

                if (statics.SourceSettings.contains(recordKey)) { // sample
                    animation.updateSource(recordKey, false, true, true, false);

                } else { // video
                    let seq = getSequenceBySample(target.index);
                    sourceman.updateSequence(seq, true);
                }

                // if (IS_ANIMATION) {
                let resolution = 630 / target.width;
                sourceman.storeSample(target.index, target.id, resolution, true);
                // }

                messaging.emitAttr('[data-id="' + recordKey + '"]', 'data-color', 'yellow');
                messaging.emitAttr('[data-id="' + recordKey + '"]', 'data-label', '...');
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
                                animation.updateSource(getSequenceSampleKey(s), 'off', true, true, false);
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
        getVideo(i) {

            if (!this.videos[i]) {
                this.videos[i] = new HC.Video(i);
            }

            return this.videos[i];
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
         */
        updateVideo(i) {
            let video = this.getVideo(i);
            if (video) {
                video.update(statics.ControlSettings.tempo, 1280, 720);
            }
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
         * @param speed
         */
        updateVideos(speed) {
            for (let i = 0; i < this.videos.length; i++) {
                if (this.videos[i]) {
                    this.videos[i].update(speed, false, false);
                }
            }
        }

        /**
         *
         */
        startVideos() {
            for (let i = 0; i < this.videos.length; i++) {
                if (this.videos[i]) {
                    this.videos[i].canvas.play();
                }
            }
        }

        /**
         *
         */
        stopVideos() {
            for (let i = 0; i < this.videos.length; i++) {
                if (this.videos[i]) {
                    this.videos[i].canvas.pause();
                }
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
            let progress = beatkeeper.getDefaultSpeed();
            for (let i = 0; i < this.samples.length; i++) {
                let sample = this.samples[i];
                if (sample && sample.record && sample.enabled && sample.initialized && !sample.complete) {
                    sample.render(renderer.current(), progress, renderer.currentColor());
                }
            }
        }
    }
}