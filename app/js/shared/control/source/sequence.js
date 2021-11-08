/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.SourceControllerSequence}
     */
    HC.SourceControllerSequence = class SourceControllerSequence {

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
        controlsNode;

        /**
         * @type {HC.GuifyFolder}
         */
        settingsFolder;

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
         * @type {HC.SourceManager}
         */
        sourceManager;

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
            this.sourceManager = controller.sourceManager;
            this.config = controller.config;
            this.index = index;

            this.init();
        }

        init() {
            let sequenceKey = 'sequence' + this.index;

            this.clipNode = document.createElement('div');
            this.clipNode.id = sequenceKey;
            // this.clipNode.setAttribute('data-title', sequenceKey);
            this.clipNode.setAttribute('class', 'sequence control');
            this.clipNode.setAttribute('data-sequence', this.index.toString());

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

            this.initControls();

            let mo = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'data-progress') {
                        this.updatePointer(mutation.target.getAttribute(mutation.attributeName));
                    }
                });
            });

            mo.observe(this.clipNode, {attributes: true});

            this.controlsNode.appendChild(this.clipNode);

            window.addEventListener('resize', this._onResize());
        }

        initControls() {
            let sequenceKey = getSequenceKey(this.index);

            this.settingsFolder = this.controller.sequenceSettingsGui.addFolder(sequenceKey, sequenceKey, true);
            this.controlsNode = this.settingsFolder.getFolderContainer();

            // let ctrl = this.controller.sourceSettingsGui.findControlByProperty(getSequenceSampleKey(this.index));
            // ctrl.getContainer().removeAttribute('data-mnemonic');
            // this.controlsNode.appendChild(ctrl.getContainer());
            //
            // ctrl = this.controller.sourceSettingsGui.findControlByProperty(this.sourceManager.getSequenceOverlayKey(this.index));
            // ctrl.getContainer().removeAttribute('data-mnemonic');
            // this.controlsNode.appendChild(ctrl.getContainer());
            //
            // ctrl = this.controller.sourceSettingsGui.findControlByProperty(sequenceKey + '_passthrough');
            // ctrl.getContainer().removeAttribute('data-mnemonic');
            // this.controlsNode.appendChild(ctrl.getContainer());
            //
            // ctrl = this.controller.sourceSettingsGui.findControlByProperty(sequenceKey + '_flipa');
            // ctrl.getContainer().removeAttribute('data-mnemonic');
            // this.controlsNode.appendChild(ctrl.getContainer());
            //
            // ctrl = this.controller.sourceSettingsGui.findControlByProperty(sequenceKey + '_flipx');
            // ctrl.getContainer().removeAttribute('data-mnemonic');
            // this.controlsNode.appendChild(ctrl.getContainer());
            //
            // ctrl = this.controller.sourceSettingsGui.findControlByProperty(sequenceKey + '_flipy');
            // ctrl.getContainer().removeAttribute('data-mnemonic');
            // this.controlsNode.appendChild(ctrl.getContainer());
            //
            // ctrl = this.controller.sourceSettingsGui.findControlByProperty(sequenceKey + '_audio');
            // ctrl.getContainer().removeAttribute('data-mnemonic');
            // this.controlsNode.appendChild(ctrl.getContainer());
            //
            // ctrl = this.controller.sourceSettingsGui.findControlByProperty(sequenceKey + '_jump');
            // ctrl.getContainer().removeAttribute('data-mnemonic');
            // this.controlsNode.appendChild(ctrl.getContainer());
            //
            // ctrl = this.controller.sourceSettingsGui.findControlByProperty(sequenceKey + '_reversed');
            // ctrl.getContainer().removeAttribute('data-mnemonic');
            // this.controlsNode.appendChild(ctrl.getContainer());
            //
            // ctrl = this.controller.sourceSettingsGui.findControlByProperty(sequenceKey + '_speeddown');
            // ctrl.getContainer().removeAttribute('data-mnemonic');
            // this.controlsNode.appendChild(ctrl.getContainer());
            //
            // ctrl = this.controller.sourceSettingsGui.findControlByProperty(sequenceKey + '_speedup');
            // ctrl.getContainer().removeAttribute('data-mnemonic');
            // this.controlsNode.appendChild(ctrl.getContainer());

            let clear = document.createElement('div');
            clear.classList.add('guify-component-container');
            clear.classList.add('clear');
            this.controlsNode.appendChild(clear);

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

            if (data) {
                if (clipEnabled !== enabled || clipSample !== sample) {
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
                this.updateIndicator(null);
                this.updatePointer(0);
                this.thumbsNode.innerHTML = '';
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
                let width = .5;
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
            let func = () => {
                let el = this.thumbsNode;
                if (el.clientHeight > 0) {
                    let ow = el.clientWidth;
                    let nh = (ow / 5 * 9 / 16);
                    el.style.height = nh + 'px';
                    this.indicatorNode.style.height = el.style.height;
                }
            };

            func();

            return func;
        }
    }
}
