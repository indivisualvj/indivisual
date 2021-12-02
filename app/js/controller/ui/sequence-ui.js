/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.SequenceUi = class SequenceUi {

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

        /**
         * @type {HC.Controller}
         */
        controller;

        /**
         * @type {HC.Config}
         */
        config;

        clip;

        /**
         *
         * @param {HC.Controller} controller
         * @param {HC.GuifyFolder} settingsFolder
         */
        constructor(controller, settingsFolder) {
            this.config = controller.config;
            this.key = settingsFolder.getKey();
            this.index = HC.numberExtract(this.key, 'sequence');
            this.settingsFolder = settingsFolder;

            this._initUi();
            this._initEvents();
        }

        _initEvents() {
            HC.EventManager.register(EVENT_CLIP_UPDATE, this.index, (config) => {
                this._updateClip(config);
            });
            HC.EventManager.register(EVENT_CLIP_INDICATOR_UPDATE, this.index, (config) => {
                this._updateIndicator(config);
            });
        }

        _initUi() {
            this.clipNode = document.createElement('div');
            this.clipNode.id = this.key;
            this.clipNode.setAttribute('class', 'sequence control');
            this.clipNode.setAttribute('data-sequence', this.key);

            this.thumbsNode  = document.createElement('div');
            this.thumbsNode.id = this.key + '_thumbs';
            this.thumbsNode.setAttribute('class', 'thumbs');
            this.clipNode.appendChild(this.thumbsNode);

            this.indicatorNode = document.createElement('div');
            this.indicatorNode.id = this.key + '_indicator';
            this.indicatorNode.setAttribute('class', 'indicator');
            this.clipNode.appendChild(this.indicatorNode);

            this.pointerNode = document.createElement('div');
            this.pointerNode.id = this.key + '_pointer';
            this.pointerNode.setAttribute('class', 'progress');
            this.indicatorNode.appendChild(this.pointerNode);

            this.controlsNode = this.settingsFolder.getFolderContainer();
            let clear = document.createElement('div');
            clear.classList.add('guify-component-container');
            clear.classList.add('clear');
            this.controlsNode.appendChild(clear);
            this.controlsNode.appendChild(this.clipNode);

            this._initObserver();

            window.addEventListener('resize', this._onResize());
        }

        _initObserver() {
            let mo = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'data-progress') {
                        requestAnimationFrame(() => {
                            this._updatePointer(mutation.target.getAttribute(mutation.attributeName));
                        });
                    }
                });
            });

            mo.observe(this.clipNode, {attributes: true});
        }

        /**
         *
         * @param clip
         * @private
         */
        _updateClip(clip) {

            if (clip) {
                this.thumbsNode.innerHTML = '';
                let thumbs = clip.thumbs;

                if (thumbs && clip !== this.clip) {
                    this.clip = clip;
                    console.log('updated clip');
                    for (let i = 0; i < thumbs.length; i++) {

                        let frameIndex = clip.thumbs[i]._index;

                        let img = clip.thumbs[i].cloneNode();
                        let div = document.createElement('div');
                        div.setAttribute('class', 'thumb');
                        div.setAttribute('data-index', frameIndex);

                        div.appendChild(img);

                        this.thumbsNode.appendChild(div);
                    }
                }

            } else {
                this._updateIndicator(null);
                this._updatePointer(0);
                this.thumbsNode.innerHTML = '';
                this.clip = null;
            }
        }

        /**
         *
         * @param clip
         * @private
         */
        _updateIndicator(clip) {
            let indicatorNode = this.indicatorNode;
            if (indicatorNode) {
                let left = 0;
                let width = .5;
                let beats = 0;
                if (clip) {
                    let length = clip.length;
                    let start = this._getSequenceStart(this.key);
                    let end = this._getSequenceEnd(this.key);
                    let sequence = {
                        start: 0,
                        end: 0,
                        length: 0
                    };

                    applySequenceSlice(sequence, length, start, end);

                    let frameDuration = clip.duration / length;
                    let beatDuration = clip.duration / clip.beats;
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
        _updatePointer(progress) {
            this.pointerNode.style.width = (progress) + '%';
            this.pointerNode.style.opacity = (progress?1:0).toString();
        }

        /**
         *
         * @param i
         * @returns {number}
         */
        _getSequenceStart(i) {
            let key = getSequenceStartKey(i);
            let value = this.config.SourceSettings[key];
            return parseInt(value);
        }

        /**
         *
         * @param i
         * @returns {number}
         * @private
         */
        _getSequenceEnd(i) {
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
