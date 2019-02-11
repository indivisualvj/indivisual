/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function () {
    HC.SourceManager = function (config) {
        this.perspectives = new Array(3);
        this.samples = config.sample;
        this.sequences = config.sequence;
        this.videos = config.video;
        this.colors = [];
    };

    HC.SourceManager.prototype = {

        /**
         *
         * @param display
         * @returns {boolean}
         */
        getSource: function (display) {

            var source = false;
            if (display) {
                display.canvas.style.display = 'block';
                display.offline = false;

                var type = statics.SourceSettings[display.id + '_source'];
                switch (type) {

                    case 'animation':
                    default:
                        source = new HC.Source(renderer, renderer.resolution.x, renderer.resolution.y);
                        break;

                    case 'sequence':
                        var sq = statics.SourceSettings[display.id + '_sequence'];
                        source = new HC.Source(this.getSequence(sq), display.width(), display.height());
                        this.updateSequence(sq);
                        break;

                    case 'perspective':
                        var sq = statics.SourceSettings[display.id + '_sequence'];
                        source = new HC.Source(this.getPerspective(sq), display.width(), display.height());
                        this.updatePerspective(sq);
                        break;

                    case 'video':
                        var vd = statics.DisplaySettings[display.id + '_video'];
                        source = new HC.Source(this.getVideo(vd), display.width(), display.height());
                        this.updateVideo(vd);
                        break;

                    case 'display':
                        var sq = statics.SourceSettings[display.id + '_sequence'];
                        source = new HC.Source(this.getDisplay(sq), display.width(), display.height());
                        break;

                    case 'black':
                        var co = 0;
                        source = new HC.Source(this.getColor(co), display.width(), display.height());
                        this.updateColor(co);
                        break;

                    case 'lighting':
                        var li = this.getLighting(0);
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
        },

        /**
         *
         * @param display
         */
        updateSource: function (display) {
            if (display) {
                display.setSource(this.getSource(display));
            }
        },

        /**
         *
         * @param i
         * @returns {*}
         */
        getSequence: function (i) {
            if (!this.sequences[i]) {
                this.sequences[i] = new HC.Sequence(i);
            }

            return this.sequences[i];
        },

        /**
         *
         * @param i
         * @param override
         */
        updateSequence: function (i, override) {
            var sequence = this.getSequence(i);
            if (sequence) {
                var smp = (statics.SourceSettings[sequence.id + '_input']);
                var os = (override ? false : sequence.sample);
                sequence.sample = this.getSample(smp);

                if (sequence.sample) {

                    var _indicator = function (sequence) {
                        var type = [0, 0, 1];
                        if (sequence.sample) {
                            type[1] = sequence.sample.last();
                            type[2] = round(sequence.sample.last()/50, 0);
                        }
                        var conf = {SourceTypes: {}};
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

                var ovrly = parseInt(statics.SourceSettings[sequence.id + '_overlay']);
                if (ovrly >= 0) {
                    sequence.overlay = this.getSequence(ovrly);

                } else {
                    sequence.overlay = false;
                }

                sequence.update(this.width, this.height);
            }
        },

        /**
         *
         * @param i
         * @returns {*|HC.Sample}
         */
        getSample: function (i) {
            if (!this.samples[i]) {

                var iKeys = Object.keys(statics.SourceValues.input);
                var sample = false;
                if (i < statics.SourceValues.sample.length) {
                    sample = new HC.Sample(i);

                } else if (i < iKeys.length-1 && i in statics.SourceValues.input) {
                    var file = statics.SourceValues.input[i];
                    var path = filePath(ASSET_DIR, file);
                    if (file.match(/.+\.(png|jpeg|jpg|tif|tiff|bmp)/)) {
                        sample = new HC.Image(i, path);

                    } else {
                        sample = new HC.Video(i, path);
                    }

                }

                if (!sample) {
                    return;
                }

                this.samples[i] = sample;

                var enabledKey = getSampleEnabledKey(sample.index);
                var recordKey  = getSampleRecordKey(sample.index);

                listener.register('sample.init.start', sample.id, function (target) {
                    messaging.emitAttr('[data-id="' + enabledKey + '"]', 'data-color', 'red');
                    messaging.emitAttr('[data-id="' + enabledKey + '"]', 'style', '');
                    messaging.emitAttr('[data-id="' + enabledKey + '"]', 'data-label', '...');
                    messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], {delay: 50});

                    var conf = {DataSettings: {}};
                    conf.DataSettings[target.id] = false;
                    messaging.emitData(target.id, conf);
                });

                listener.register('sample.init.progress', sample.id, function (target) {
                    var key = getSampleEnabledKey(i);
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

                    var conf = {DataSettings: {}};
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
                    var conf = {DataSettings: {}};
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
                    var conf = {
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

                    var recordKey  = getSampleRecordKey(target.index);

                    if (statics.SourceSettings.contains(recordKey)) { // sample
                        animation.updateSource(recordKey, false, true, true, false);

                    } else { // video
                        var seq = getSequenceBySample(target.index);
                        sourceman.updateSequence(seq, true);
                    }

                    var resolution = 630 / target.width;
                    sourceman.storeSample(target.index, target.id, resolution, true);

                    messaging.emitAttr('[data-id="' + recordKey + '"]', 'data-color', 'yellow');
                    messaging.emitAttr('[data-id="' + recordKey + '"]', 'data-label', '...');
                    messaging.emitMidi('glow', MIDI_ROW_ONE[target.index], {delay: 50});
                    messaging.emitMidi('off', MIDI_SAMPLE_FEEDBACK);
                });

            }

            return this.samples[i];
        },

        /**
         *
         * @param sample
         */
        updateSample: function (i) {
            var sample = this.getSample(i);
            if (sample) {
                sample.update(statics.ControlSettings.tempo, this.width, this.height);

                if (!sample.enabled && sample instanceof HC.Sample) {
                    sample.reset();

                    var warn = false;
                    if (sample.index < statics.SourceValues.sample.length) {
                        for (var s = 0; s < this.sequences.length; s++) {
                            var seq = this.getSequence(s);
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
        },

        /**
         *
         */
        storeSample: function (i, name, resolution, load) {
            var sample = this.getSample(i);
            if (IS_ANIMATION && sample) {

                var dir = SAMPLE_DIR + '/' + name;
                var callback = function () {

                    messaging._emit({action: 'unlinkall', dir: dir}, function () {
                        listener.register('sample.store.progress', sample.id, function (target) {
                            var key = getSampleStoreKey(target.index);
                            messaging.emitAttr('[data-id="' + key + '"]', 'data-label', target.pointer + '/' + target.frames.length);
                            messaging.emitAttr('[data-id="' + key + '"]', 'data-color', 'red');
                        });
                        listener.register('sample.store.end', sample.id, function (target) {
                            var key = getSampleStoreKey(target.index);
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
        },

        /**
         *
         */
        loadSample: function (i, name) {
            var sample = this.getSample(i);
            if (sample) {
                listener.register('sample.load.progress', sample.id, function (target) {
                    var key = getSampleLoadKey(i);
                    messaging.emitAttr('[data-id="' + key + '"]', 'data-label', target.pointer + '/' + target.frames.length);
                    messaging.emitAttr('[data-id="' + key + '"]', 'data-color', 'red');
                });
                listener.register('sample.load.end', sample.id, function (target) {
                    var key = getSampleLoadKey(i);
                    messaging.emitAttr('[data-id="' + key + '"]', 'data-label', '');
                    messaging.emitAttr('[data-id="' + key + '"]', 'data-color', '');
                });
                sample.load(name, this.width, this.height);
            }
        },

        /**
         *
         * @param i
         * @returns {*}
         */
        getVideo: function (i) {

            if (!this.videos[i]) {
                this.videos[i] = new HC.Video(i);
            }

            return this.videos[i];
        },

        /**
         *
         * @param i
         * @returns {*}
         */
        getDisplay: function (i) {
            return displayman.getDisplay(i);
        },

        /**
         *
         * @param i
         * @returns {HC.Color}
         */
        getColor: function (i) {
            if (!this.colors[i]) {
                this.colors[i] = new HC.Color(i);
            }

            return this.colors[i];
        },

        /**
         *
         * @param i
         * @returns {HC.Lighting|*}
         */
        getLighting: function (i) {
            if (!this.lighting) {
                this.lighting = new HC.Lighting(i);
            }

            return this.lighting;
        },

        /**
         *
         * @param i
         */
        updateVideo: function (i) {
            var video = this.getVideo(i);
            if (video) {
                video.update(statics.ControlSettings.tempo, 1280, 720);
            }
        },

        /**
         *
         * @param i
         * @returns {*}
         */
        getPerspective: function (i) {
            if (!this.perspectives[i]) {
                this.perspectives[i] = new HC.Perspective(i);
            }

            return this.perspectives[i];
        },

        /**
         *
         * @param i
         */
        updatePerspective: function (i) {
            var perspective = this.getPerspective(i);
            if (perspective) {
                perspective.update(this.width, this.height);
            }
        },

        /**
         *
         * @param i
         */
        updateColor: function (i) {
            var color = this.getColor(i);
            if (color) {
                color.update(this.width, this.height);
            }
        },

        /**
         *
         * @param speed
         */
        updateVideos: function (speed) {
            for (var i = 0; i < this.videos.length; i++) {
                if (this.videos[i]) {
                    this.videos[i].update(speed, false, false);
                }
            }
        },

        /**
         *
         */
        startVideos: function () {
            for (var i = 0; i < this.videos.length; i++) {
                if (this.videos[i]) {
                    this.videos[i].canvas.play();
                }
            }
        },

        /**
         *
         */
        stopVideos: function () {
            for (var i = 0; i < this.videos.length; i++) {
                if (this.videos[i]) {
                    this.videos[i].canvas.pause();
                }
            }
        },

        /**
         *
         */
        updateSources: function () {
            for (var i = 0; i < displayman.displays.length; i++) {
                this.updateSource(displayman.getDisplay(i));
            }
        },

        /**
         *
         */
        updateSequences: function () {
            for (var i = 0; i < this.sequences.length; i++) {
                this.updateSequence(i);
            }
        },

        /**
         *
         * @param resolution
         */
        resize: function (resolution) {
            this.width = resolution.x;
            this.height = resolution.y;
        },

        /**
         *
         * @param doNotDisplay
         */
        render: function (doNotDisplay) {
            if (this.animationInUse()) {
                renderer.render();
            }
            this.renderSamples();
            if (!doNotDisplay) {
                this.renderSequences();
            }
        },

        /**
         *
         */
        renderPerspectives: function () {
            for (var i = 0; i < displayman.displays.length; i++) {
                var dsp = displayman.displays[i];
                if (dsp && dsp.visible && getDisplaySource(i) == 'perspective') {
                    this.getPerspective(getDisplaySequence(i)).next();
                }
            }
        },

        /**
         *
         * @param progress
         */
        renderSamples: function () {
            var progress = beatkeeper.getDefaultSpeed();
            for (var i = 0; i < this.samples.length; i++) {
                var sample = this.samples[i];
                if (IS_ANIMATION && sample && sample.record && sample.enabled && sample.initialized && !sample.complete) {
                    sample.render(renderer.current(), progress, renderer.currentColor());
                }
            }
        },

        /**
         *
         */
        renderSequences: function () {
            for (var i = 0; i < this.sequences.length; i++) {
                var sequence = this.sequences[i];
                if (sequence) {
                    sequence.next(beatkeeper.getDefaultSpeed());
                }
            }
        },

        /**
         *
         * @returns {boolean}
         */
        animationInUse: function () {
            var inuse = false;

            if (!animation.offline) { // todo bei passthrough overlay nicht offline!
                for (var dpl = 0; !inuse && dpl < statics.DisplayValues.display.length; dpl++) {
                    var visible = getDisplayVisible(dpl);
                    if (visible) {
                        var src = getDisplaySource(dpl);
                        if (src == 'sequence') {
                            var seq = getDisplaySequence(dpl);
                            var smp = getSampleBySequence(seq);
                            smp = this.samples[smp];
                            if (!smp || !smp.enabled) {
                                inuse = true;

                            } else {
                                inuse = !smp.isReady();
                            }

                        } else if (src == 'animation') {
                            inuse = true;
                        }
                    }
                }

                if (!inuse) {
                    for (var i = 0; !inuse && i < this.samples.length; i++) {
                        var smp = this.samples[i];
                        if (smp && smp.enabled && smp.record) {
                            inuse = true;
                        }
                    }
                }
            }

            animation.offline = !inuse;

            return inuse;
        }
    };
})();