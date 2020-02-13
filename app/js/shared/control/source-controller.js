/**
 * @author indivisualvj / https://github.com/indivisualvj
 */


HC.SourceController = HC.SourceController || {};

{
    /**
     *
     * @type {HC.SourceController.lighting}
     */
    HC.SourceController.lighting = class lighting extends HC.ControlSet {
        static index = 10;

        settings = {
            lighting_type: 'off',
            lighting_color: 'current',
            lighting_brightness: 1.0,
            lighting_speed: 'eight',
            lighting_pattern_lights: 1,
            lighting_scale: 1
        };

        types = {
            lighting_brightness: [0, 1, 0.02],
            lighting_pattern_lights: [1, 60, 1],
            lighting_scale: [1, 10, 1]
        };

        styles = {
            lighting_type: ['half', 'clear'],
            lighting_color: ['half'],
            lighting_speed: ['half', 'clear'],
            lighting_brightness: ['half'],
            lighting_pattern_lights: ['half', 'clear'],
            lighting_scale: ['half']
        }
    }
}

{
    /**
     *
     * @type {HC.SourceController.source}
     */
    HC.SourceController.source = class source extends HC.ControlSet {
        static index = 20;

        settings = {
            group0: '',
            group1: ''
        };

        types = {
            
        };

        styles = {
            display_source: ['half', 'clear'],
            display_sequence: ['half'],

            group0: ['half', 'clear'],
            group1: ['half'],

            seq_0: ['hex', 'clear'],
            seq_1: ['hex'],
            seq_2: ['hex'],
            seq_3: ['hex'],
            seq_4: ['hex'],
            seq_inc: ['hex'],
        };

        values = {
            display_source: 'animation',
            display_sequence: 0
        };

        init(pluggedValues) {
            this.createSettings(pluggedValues);
            super.init(pluggedValues);
        }

        /**
         *
         * @param pluggedValues
         */
        createSettings(pluggedValues) {

            this.createGroupSettings(pluggedValues);

            // create source settings
            this.createSourceSettings(pluggedValues);

            // append seq buttons and material_map
            this.appendSeqButtons();

            this.settings.material_map = 'none';
        }

        /**
         *
         * @param pluggedValues
         */
        createGroupSettings(pluggedValues) {
            let _create = (value, group) => {
                return function () {
                    messaging.program.setAllDisplaysTo('source', value, group);
                }
            };
            let _add = (group) => {
                let first = true;
                for (let k in pluggedValues.display_source) {
                    let key = group.replace('roup', '') + k;
                    this.styles[key] = ['hex'];
                    if (first) {
                        this.styles[key][1] = 'clear';
                        first = false;
                    }
                    this.settings[key] = _create(k, group);
                }
            };

            _add('group0');
            _add('group1');
        }

        /**
         *
         * @param pluggedValues
         */
        createSourceSettings(pluggedValues) {
            let okey = 'display';
            for (let i = 0; i < this.config.DisplayValues.display.length; i++) {

                let key = 'display' + i;

                // settings
                this.settings[key + '_source'] = this.values[okey + '_source'];
                this.settings[key + '_sequence'] = this.values[okey + '_sequence'];

                // values
                this.values[key + '_source'] = pluggedValues['display_source'];
                this.values[key + '_sequence'] = pluggedValues['sequence'];

                // types
                this.types[key + '_source'] = this.types[okey + '_source'];
                this.types[key + '_sequence'] = this.types[okey + '_sequence'];

                // styles
                this.styles[key + '_source'] = this.styles[okey + '_source'];
                this.styles[key + '_sequence'] = this.styles[okey + '_sequence'];

            }
        }

        /**
         *
         */
        appendSeqButtons() {
            this.settings.seq_0 = function () {
                messaging.program.setAllDisplaysTo('sequence', 0);
            };
            this.settings.seq_1 = function () {
                messaging.program.setAllDisplaysTo('sequence', 1);
            };
            this.settings.seq_2 = function () {
                messaging.program.setAllDisplaysTo('sequence', 2);
            };
            this.settings.seq_3 = function () {
                messaging.program.setAllDisplaysTo('sequence', 3);
            };
            this.settings.seq_4 = function () {
                messaging.program.setAllDisplaysTo('sequence', 4);
            };
            this.settings.seq_inc = function () {
                messaging.program.setAllDisplaysTo('sequence', false);
            };


        }
    }
}

{
    /**
     *
     * @type {HC.SourceController.sequence}
     */
    HC.SourceController.sequence = class sequence extends HC.ControlSet {
        static index = 20;

        settings = {
            sequence0_input: 'off',
            sequence0_overlay: 'off',
            sequence0_brightness: 1.0,
            sequence0_blendmode: '0',
            sequence1_input: 'off',
            sequence1_overlay: 'off',
            sequence1_brightness: 1.0,
            sequence1_blendmode: '0',
            sequence2_input: 'off',
            sequence2_overlay: 'off',
            sequence2_brightness: 1.0,
            sequence2_blendmode: '0',
            sequence3_input: 'off',
            sequence3_overlay: 'off',
            sequence3_brightness: 1.0,
            sequence3_blendmode: '0',
            sequence4_input: 'off',
            sequence4_overlay: 'off',
            sequence4_brightness: 1.0,
            sequence4_blendmode: '0',
            sequence0_jump: false,
            sequence1_jump: false,
            sequence2_jump: false,
            sequence3_jump: false,
            sequence4_jump: false,
            sequence0_audio: false,
            sequence1_audio: false,
            sequence2_audio: false,
            sequence3_audio: false,
            sequence4_audio: false,
            sequence0_reversed: false,
            sequence1_reversed: false,
            sequence2_reversed: false,
            sequence3_reversed: false,
            sequence4_reversed: false,
            sequence0_speedup: false,
            sequence1_speedup: false,
            sequence2_speedup: false,
            sequence3_speedup: false,
            sequence4_speedup: false,
            sequence0_speeddown: false,
            sequence1_speeddown: false,
            sequence2_speeddown: false,
            sequence3_speeddown: false,
            sequence4_speeddown: false,
            sequence0_flipx: false,
            sequence1_flipx: false,
            sequence2_flipx: false,
            sequence3_flipx: false,
            sequence4_flipx: false,
            sequence0_flipy: false,
            sequence1_flipy: false,
            sequence2_flipy: false,
            sequence3_flipy: false,
            sequence4_flipy: false,
            sequence0_flipa: false,
            sequence1_flipa: false,
            sequence2_flipa: false,
            sequence3_flipa: false,
            sequence4_flipa: false,
            sequence0_passthrough: false,
            sequence1_passthrough: false,
            sequence2_passthrough: false,
            sequence3_passthrough: false,
            sequence4_passthrough: false,
            sequence0_speed: 1.0,
            sequence1_speed: 1.0,
            sequence2_speed: 1.0,
            sequence3_speed: 1.0,
            sequence4_speed: 1.0,
            sequence0_osci: 'off',
            sequence1_osci: 'off',
            sequence2_osci: 'off',
            sequence3_osci: 'off',
            sequence4_osci: 'off',
            sequence0_start: 0,
            sequence1_start: 0,
            sequence2_start: 0,
            sequence3_start: 0,
            sequence4_start: 0,
            sequence0_end: 0,
            sequence1_end: 0,
            sequence2_end: 0,
            sequence3_end: 0,
            sequence4_end: 0,
        };

        types = {
            sequence0_brightness: [0, 1, 0.02],
            sequence1_brightness: [0, 1, 0.02],
            sequence2_brightness: [0, 1, 0.02],
            sequence3_brightness: [0, 1, 0.02],
            sequence4_brightness: [0, 1, 0.02],
            sequence0_speed: [-2, 2, 0.1, 'hidden'],
            sequence1_speed: [-2, 2, 0.1, 'hidden'],
            sequence2_speed: [-2, 2, 0.1, 'hidden'],
            sequence3_speed: [-2, 2, 0.1, 'hidden'],
            sequence4_speed: [-2, 2, 0.1, 'hidden'],
            sequence0_jump: ['hidden'],
            sequence1_jump: ['hidden'],
            sequence2_jump: ['hidden'],
            sequence3_jump: ['hidden'],
            sequence4_jump: ['hidden'],
            sequence0_audio: ['hidden'],
            sequence1_audio: ['hidden'],
            sequence2_audio: ['hidden'],
            sequence3_audio: ['hidden'],
            sequence4_audio: ['hidden'],
            sequence0_reversed: ['hidden'],
            sequence1_reversed: ['hidden'],
            sequence2_reversed: ['hidden'],
            sequence3_reversed: ['hidden'],
            sequence4_reversed: ['hidden'],
            sequence0_speedup: ['hidden'],
            sequence1_speedup: ['hidden'],
            sequence2_speedup: ['hidden'],
            sequence3_speedup: ['hidden'],
            sequence4_speedup: ['hidden'],
            sequence0_speeddown: ['hidden'],
            sequence1_speeddown: ['hidden'],
            sequence2_speeddown: ['hidden'],
            sequence3_speeddown: ['hidden'],
            sequence4_speeddown: ['hidden'],
            sequence0_flipx: ['hidden'],
            sequence1_flipx: ['hidden'],
            sequence2_flipx: ['hidden'],
            sequence3_flipx: ['hidden'],
            sequence4_flipx: ['hidden'],
            sequence0_flipy: ['hidden'],
            sequence1_flipy: ['hidden'],
            sequence2_flipy: ['hidden'],
            sequence3_flipy: ['hidden'],
            sequence4_flipy: ['hidden'],
            sequence0_flipa: ['hidden'],
            sequence1_flipa: ['hidden'],
            sequence2_flipa: ['hidden'],
            sequence3_flipa: ['hidden'],
            sequence4_flipa: ['hidden'],
            sequence0_passthrough: ['hidden'],
            sequence1_passthrough: ['hidden'],
            sequence2_passthrough: ['hidden'],
            sequence3_passthrough: ['hidden'],
            sequence4_passthrough: ['hidden'],
            sequence0_start: [0, 100, 1, 'hidden'],
            sequence1_start: [0, 100, 1, 'hidden'],
            sequence2_start: [0, 100, 1, 'hidden'],
            sequence3_start: [0, 100, 1, 'hidden'],
            sequence4_start: [0, 100, 1, 'hidden'],
            sequence0_end: [0, 100, 1, 'hidden'],
            sequence1_end: [0, 100, 1, 'hidden'],
            sequence2_end: [0, 100, 1, 'hidden'],
            sequence3_end: [0, 100, 1, 'hidden'],
            sequence4_end: [0, 100, 1, 'hidden'],
            sequence0_osci: ['hidden'],
            sequence1_osci: ['hidden'],
            sequence2_osci: ['hidden'],
            sequence3_osci: ['hidden'],
            sequence4_osci: ['hidden'],
            sequence0_reset: ['hidden'],
            sequence1_reset: ['hidden'],
            sequence2_reset: ['hidden'],
            sequence3_reset: ['hidden'],
            sequence4_reset: ['hidden'],
            sequence0_rereset: ['hidden'],
            sequence1_rereset: ['hidden'],
            sequence2_rereset: ['hidden'],
            sequence3_rereset: ['hidden'],
            sequence4_rereset: ['hidden'],
        };
        
        styles = {
            sequence0_input: ['half', 'clear'],
            sequence1_input: ['half', 'clear'],
            sequence2_input: ['half', 'clear'],
            sequence3_input: ['half', 'clear'],
            sequence4_input: ['half', 'clear'],
            sequence0_overlay: ['half'],
            sequence1_overlay: ['half'],
            sequence2_overlay: ['half'],
            sequence3_overlay: ['half'],
            sequence4_overlay: ['half'],
            sequence0_blendmode: ['half'],
            sequence1_blendmode: ['half'],
            sequence2_blendmode: ['half'],
            sequence3_blendmode: ['half'],
            sequence4_blendmode: ['half'],
            sequence0_brightness: ['half', 'clear'],
            sequence1_brightness: ['half', 'clear'],
            sequence2_brightness: ['half', 'clear'],
            sequence3_brightness: ['half', 'clear'],
            sequence4_brightness: ['half', 'clear'],
        };

        values = {

        };

        init(pluggedValues) {
            this.createSettings(pluggedValues);
            super.init(pluggedValues);
        }

        /**
         *
         * @param pluggedValues
         */
        createSettings(pluggedValues) {

            for (let k in pluggedValues.sequence) {

                this.values['sequence' + k + '_input'] = pluggedValues.input;
                this.values['sequence' + k + '_overlay'] = pluggedValues.overlay;
                this.values['sequence' + k + '_blendmode'] = pluggedValues.blendmode;
                this.values['sequence' + k + '_osci'] = pluggedValues.oscillator;
            }

            this.createResets(pluggedValues);
        }

        /**
         *
         * @param pluggedValues
         */
        createResets(pluggedValues)  {
            let _reset = (seq) => {
                let key = getSequenceKey(seq);
                this.settings[key + '_reset'] = () => {
                    let updates = {};
                    updates[key + '_jump'] = false;
                    updates[key + '_audio'] = false;
                    updates[key + '_flipa'] = false;
                    updates[key + '_flipx'] = false;
                    updates[key + '_flipy'] = false;
                    updates[key + '_speedup'] = false;
                    updates[key + '_speeddown'] = false;
                    updates[key + '_reversed'] = false;
                    updates[key + '_passthrough'] = false;
                    updates[key + '_speed'] = 1.0;

                    updates[getSequenceStartKey(seq)] = 0;

                    let endKey = getSequenceEndKey(seq);
                    updates[endKey] = 0;

                    messaging.program.updateSources(updates, true, false, false);
                    messaging.emitSources(updates, true, true, false);
                };
            };

            _reset(0);
            _reset(1);
            _reset(2);
            _reset(3);
            _reset(4);

            let _rereset = (seq) => {
                let key = getSequenceKey(seq);
                this.settings[key + '_rereset'] = () => {
                    let updates = {};
                    updates[key + '_overlay'] = this.values[key + '_overlay'];
                    updates[key + '_input'] = this.values[key + '_input'];
                    updates[key + '_blendmode'] = this.values[key + '_blendmode'];
                    updates[key + '_osci'] = this.values[key + '_osci'];

                    messaging.program.updateSources(updates, true, false, false);
                    messaging.emitSources(updates, true, true, false);
                };
            };

            _rereset(0);
            _rereset(1);
            _rereset(2);
            _rereset(3);
            _rereset(4);
        }
    }
}

{
    /**
     *
     * @type {HC.SourceController.sample}
     */
    HC.SourceController.sample = class sample extends HC.ControlSet {
        static index = 40;

        settings = {
            sample0_enabled: false,
            sample0_record: false,
            sample0_beats: 4,
            sample1_enabled: false,
            sample1_record: false,
            sample1_beats: 4,
            sample2_enabled: false,
            sample2_record: false,
            sample2_beats: 4,
            sample3_enabled: false,
            sample3_record: false,
            sample3_beats: 4,
            sample4_enabled: false,
            sample4_record: false,
            sample4_beats: 4,
            sample5_enabled: false,
            sample5_record: false,
            sample5_beats: 4,
            sample0_load: false,
            sample1_load: false,
            sample2_load: false,
            sample3_load: false,
            sample4_load: false,
            sample5_load: false,
        };

        types = {
            sample0_load: ['hidden'],
            sample1_load: ['hidden'],
            sample2_load: ['hidden'],
            sample3_load: ['hidden'],
            sample4_load: ['hidden'],
            sample5_load: ['hidden'],

        };

        styles = {
            bts_2: ['quint'],
            bts_4: ['quint'],
            bts_8: ['quint'],
            bts_16: ['quint'],
            bts_32: ['quint'],
        };

        values = {
        };

        init(pluggedValues) {
            this.createSettings(pluggedValues);
            super.init(pluggedValues);
        }

        createSettings(pluggedValues) {
            this.createSampleSettings(pluggedValues);
        }

        createSampleSettings(pluggedValues) {
            for (let i in pluggedValues.sample) {
                let beatKey = getSampleBeatKey(i);
                this.values[beatKey] = pluggedValues.beats;
            }
        }
    }
}

{
    /**
     *
     * @type {HC.SourceControllerUi}
     */
    HC.SourceControllerUi = class SourceControllerUi extends HC.ControlSetGuifyUi {

        /**
         *
         * @param value
         * @param that
         */
        onChange(value, that) {
            messaging.program.updateSource(that.getProperty(), value, true, true, false);
        }
    }
}

{
    /**
     *
     * @type {HC.SourceControllerClip}
     */
    HC.SourceControllerClip = class SourceControllerClip {

        /**
         * @type {number}
         */
        index;

        /**
         * @type {HTMLElement}
         */
        clipNode;

        /**
         * @type {HTMLElement}
         */
        thumbsNode;

        /**
         * @type {HTMLElement}
         */
        indicatorNode;

        /**
         * @type {HTMLElement}
         */
        pointerNode;

        sample;

        enabled = false;

        /**
         * @type {HC.Controller}
         */
        controller;

        /**
         * @type {HC.Config}
         */
        config;

        /**
         *
         * @param {HC.Controller} controller
         * @param index
         */
        constructor(controller, index) {
            this.controller = controller;
            this.config = controller.config;
            this.index = index;

            this.init();
        }

        init() {
            let el = document.getElementById('sequences');
            let sequenceKey = 'sequence' + this.index;
            this.clipNode = document.createElement('div');
            this.clipNode.id = sequenceKey;
            this.clipNode.setAttribute('data-title', sequenceKey);
            this.clipNode.setAttribute('class', 'sequence control');

            this.thumbsNode  = document.createElement('div');
            this.thumbsNode.id = sequenceKey + '_thumbs';
            this.thumbsNode.setAttribute('class', 'thumbs');
            this.clipNode.appendChild(this.thumbsNode);

            this.indicatorNode = document.createElement('div');
            this.indicatorNode.id = sequenceKey + '_indicator';
            this.indicatorNode.setAttribute('class', 'indicator');
            this.clipNode.appendChild(this.indicatorNode);

            this.pointerNode = document.createElement('div');
            this.pointerNode.id = sequenceKey + '_pointer';
            this.pointerNode.setAttribute('class', 'progress');
            this.indicatorNode.appendChild(this.pointerNode);

            let mo = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName == 'data-progress') {
                        this.updatePointer(mutation.target.getAttribute(mutation.attributeName));
                    }
                });
            });

            mo.observe(this.clipNode, {attributes: true});

            el.appendChild(this.clipNode);

            window.addEventListener('resize', this._onResize());

            this.setVisible(false);
        }

        /**
         *
         * @param sample
         * @param enabled
         * @param data
         */
        update(sample, enabled, data) {
            let clipSample = this.sample;
            let clipEnabled = this.enabled;
            this.sample = sample;
            this.enabled = enabled;

            this.setVisible(enabled);

            if (data) {

                if (clipEnabled != enabled || clipSample != sample) {
                    this.thumbsNode.innerHTML = '';

                } else {
                    return;
                }

                let thumbs = data.thumbs;

                if (thumbs) {
                    for (let i = 0; i < thumbs.length; i++) {

                        let frameIndex = data.thumbs[i]._index;

                        let img = data.thumbs[i].cloneNode();
                        let div = document.createElement('div');
                        div.setAttribute('class', 'thumb');
                        div.setAttribute('data-index', frameIndex);

                        div.appendChild(img);

                        this.thumbsNode.appendChild(div);
                    }
                }

            } else {
                this.thumbsNode.innerHTML = '';
            }
        }

        /**
         *
         * @param v
         */
        setVisible(v) {
            if (v) {
                this.clipNode.style.display = '';
                this._onResize();

            } else {
                this.clipNode.style.display = 'none';
            }
        }

        /**
         *
         * @param data
         */
        updateIndicator(data) {
            let indicatorNode = this.indicatorNode;
            if (indicatorNode) {
                let left = 0;
                let width = 0;
                let beats = 0;
                if (data) {
                    let length = data.length;
                    let start = this.getSequenceStart(this.index);
                    let end = this.getSequenceEnd(this.index);
                    let sequence = {
                        start: 0,
                        end: 0,
                        length: 0
                    };

                    this.controller.sourceManager.applySequenceSlice(sequence, length, start, end);

                    let frameDuration = data.duration / length;
                    let beatDuration = data.duration / data.beats;
                    let sliceDuration = sequence.length * frameDuration;
                    beats = sliceDuration / beatDuration;
                    width = sequence.length / length * 100;
                    left = sequence.start / length * 100;
                }

                indicatorNode.setAttribute('data-label', beats.toFixed(2));
                indicatorNode.style.left = left + '%';
                indicatorNode.style.width = (width - .5) + '%';
            }
        }

        /**
         *
         * @param progress
         */
        updatePointer(progress) {
            this.pointerNode.style.width = (progress) + '%';
            this.pointerNode.style.opacity = (progress?1:0).toString();
        }

        /**
         *
         * @param i
         * @returns {*}
         */
        getSequenceStart(i) {
            let key = getSequenceStartKey(i);
            let value = this.config.SourceSettings[key];
            return parseInt(value);
        }

        /**
         *
         * @param i
         * @returns {*}
         */
        getSequenceEnd(i) {
            let key = getSequenceEndKey(i);
            let value = this.config.SourceSettings[key];
            return parseInt(value);
        }


        /**
         *
         * @private
         */
        _onResize() {
            let func = (e) => {
                let el = this.clipNode;
                let ow = el.clientWidth;
                let nh = (ow / 5 * 9 / 16);
                el.style.height = nh + 'px';
            };

            func();

            return func;
        }
    }
}

{
    /**
     *
     * @type {HC.SourceControllerThumb}
     */
    HC.SourceControllerThumb = class SourceControllerThumb {

        /**
         * @type {HTMLElement}
         */
        node;

        /**
         * @type {HTMLElement}
         */
        controls;

        /**
         * @type {number}
         */
        index;

        /**
         * @type {HC.Controller}
         */
        controller;

        /**
         * @type {HC.Config}
         */
        config;

        /**
         *
         * @param {HC.Controller} controller
         * @param index
         */
        constructor(controller, index) {
            this.controller = controller;
            this.config = controller.config;
            this.index = index;

            this.init();
        }

        /**
         *
         */
        init() {
            let el = document.getElementById('samples');

            this.node = document.createElement('div');
            this.node.id = 'sample' + this.index;
            this.node.setAttribute('class', 'sample control');
            this.node.setAttribute('draggable', 'true');

            this.controls = document.createElement('div');
            this.controls.classList.add('controls');

            this.controller.sourceSettingsGui.findFolderByKey('sample').setVisible(false);

            let ctrl = this.controller.sourceSettingsGui.findControlByProperty(getSampleEnabledKey(this.index));
            ctrl.setMnemonic(null); // keyboard initialization happens after init thumbs...
            this.controls.appendChild(ctrl.getContainer());
            ctrl = this.controller.sourceSettingsGui.findControlByProperty(getSampleRecordKey(this.index));
            ctrl.setMnemonic(null);
            this.controls.appendChild(ctrl.getContainer());
            ctrl = this.controller.sourceSettingsGui.findControlByProperty(getSampleBeatKey(this.index));
            ctrl.setMnemonic(null);
            this.controls.appendChild(ctrl.getContainer());

            this.node.appendChild(this.controls);

            el.appendChild(this.node);

            this.initDragAndDrop();

            window.addEventListener('resize', this._onResize);

            this._onResize();

            let mo = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName == 'data-progress') {
                        this.setProgress(mutation.target.getAttribute(mutation.attributeName));
                    }
                });
            });

            mo.observe(this.node, {attributes: true});
        }

        /**
         *
         */
        initDragAndDrop() {

            let sequences;
            let currentSequence;

            let _dragover = (e) => {

                if (currentSequence) {
                    currentSequence.style.borderColor = null;
                }

                currentSequence = e.target.parentElement;
                currentSequence.style.borderColor = 'red';

            };

            let _enableSequences = (display) => {
                if (sequences) {
                    sequences.forEach((sequence) => {
                        sequence.parentElement.style.display = display ? 'block' : 'none';
                        sequence.parentElement.style.borderColor = null;

                        if (display) {
                            sequence.addEventListener('dragover', _dragover);

                        } else {
                            sequence.removeEventListener('dragover', _dragover);
                        }
                    });
                }
            };

            this.node.addEventListener('dragstart', (e) => {

                let enabledKey = getSampleEnabledKey(this.index);
                if (!this.config.SourceSettingsManager.get('sample').get(enabledKey)) {
                    e.stopPropagation();
                    return false;
                }

                _enableSequences(false);
                sequences = document.querySelectorAll('#sequences > div > [id^="sequence"]');
                _enableSequences(true);
            });

            this.node.addEventListener('dragend', (e) => {
                _enableSequences(false);

                if (currentSequence) {
                    let seq = numberExtract(currentSequence.id, 'sequence');
                    let smp = this.index;
                    this.controller.updateSource(getSequenceSampleKey(seq), smp, true, true, false);

                    currentSequence = null;
                }
            });
        }

        /**
         *
         * @param data
         */
        update(data) {
            let enabled = this.controller.sourceManager.getSampleEnabledBySample(this.index) && (data != false);
            if (enabled && data && data.thumbs) {
                let src = data.thumbs[Math.round(data.thumbs.length / 2)].src;
                this.node.style.backgroundImage = 'url(' + src + ')';
                this.node.style.backgroundPositionX = 'center';
                this.node.style.backgroundPositionY = 'center';
                this.node.style.backgroundSize = '50%';
                this.node.setAttribute('data-label', 'ready to play');

            } else {
                this.node.style.backgroundImage = '';
            }
        }

        /**
         *
         * @param prc
         */
        setProgress(prc) {
            if (!prc || prc < 0 || prc > 100) {
                this.node.style.background = '';
            } else {
                let bg = 'linear-gradient(90deg, #2fa1d6, #2fa1d6 ' + prc + '%, black, black 0%)';
                this.node.style.background = bg;
            }
        }

        /**
         *
         * @private
         */
        _onResize() {
            let el = document.getElementById('samples');
            let ow = el.clientWidth;
            let nh = (ow / 5 * 9 / 16);
            el.style.height = nh + 'px';
        }
    }
}
