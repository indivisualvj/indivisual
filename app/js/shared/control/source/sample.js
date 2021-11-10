/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.SourceControllerSample}
     */
    HC.SourceControllerSample = class SourceControllerSample {

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
        }

        /**
         *
         */
        init() {
            let el = document.getElementById('samples');

            this.node = document.createElement('div');
            this.node.id = 'sample' + this.index;
            this.node.setAttribute('data-sample', this.index.toString());
            this.node.setAttribute('class', 'sample control');
            this.node.setAttribute('draggable', 'true');

            this.controls = document.createElement('div');
            this.controls.classList.add('controls');

            this.controller.sourceSettingsGui.findFolderByKey('sample').setVisible(false);

            let ctrl = this.controller.sourceSettingsGui.findControlByProperty(getSampleEnabledKey(this.index));
            this.controls.appendChild(ctrl.getContainer());
            ctrl = this.controller.sourceSettingsGui.findControlByProperty(getSampleRecordKey(this.index));
            this.controls.appendChild(ctrl.getContainer());
            ctrl = this.controller.sourceSettingsGui.findControlByProperty(getSampleBeatKey(this.index));
            this.controls.appendChild(ctrl.getContainer());

            this.node.appendChild(this.controls);

            el.appendChild(this.node);

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
        initDragAndDrop(sequences) {

            let currentSequence;

            this.node.addEventListener('dragstart', (e) => {
                let enabledKey = getSampleEnabledKey(this.index);
                if (!this.config.SourceSettingsManager.get('sample').get(enabledKey)) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                e.dataTransfer.setData('text/plain', enabledKey);
                e.dataTransfer.dropEffect = 'link';
                e.dataTransfer.effectAllowed = 'link';

                e.dataTransfer.setDragImage(new Image(0, 0), 0, 0);
                this.controller.sequenceSettingsGui.setOpen(true);
                for (let key in this.controller.sequenceSettingsGui.children) {
                    this.controller.sequenceSettingsGui.getChild(key).setOpen(true);
                }

                sequences.forEach((sequence) => {
                    sequence._dragOver = (e) => {
                        if ((currentSequence = e.target.ancestorOfClass('sequence'))) {
                            currentSequence.style.borderColor = 'red';
                        }
                    };
                    sequence.addEventListener('dragover', sequence._dragOver);
                });
            });

            this.node.addEventListener('dragend', (e) => {
                if (e.dataTransfer.dropEffect === 'link' && currentSequence) {
                    let seq = parseInt(currentSequence.getAttribute('data-sequence'));
                    if (isNumber(seq)) {
                        let smp = this.index;
                        this.controller.updateSource(getSequenceSampleKey(seq), smp, true, true, false);
                    }
                    currentSequence = null;
                }

                sequences.forEach((sequence) => {
                    sequence.style.borderColor = '';
                    sequence.removeEventListener('dragover', sequence._dragOver);
                });
            });
        }

        /**
         *
         * @param data
         */
        update(data) {
            let enabled = this.controller.sourceManager.getSampleEnabledBySample(this.index) && (data !== false);
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
