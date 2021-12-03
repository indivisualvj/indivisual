/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class SampleUi {

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
     *
     * @type {boolean}
     */
    enabled = false;


    /**
     *
     * @param index
     */
    constructor(index) {
        this.index = index;
    }

    /**
     *
     * @param {HTMLElement}container
     */
    init(container) {
        this.node = document.createElement('div');
        this.node.id = 'sample' + this.index;
        this.node.setAttribute('data-mnemonic', this.node.id);
        this.node.setAttribute('data-sample', this.index.toString());
        this.node.setAttribute('class', 'sample control');
        this.node.setAttribute('draggable', 'true');

        container.appendChild(this.node);

        window.addEventListener('resize', () => {
            this._onResize();
        });

        this._onResize();

        let mo = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-progress') {
                    this.setProgress(mutation.target.getAttribute(mutation.attributeName));
                }
            });
        });

        mo.observe(this.node, {attributes: true});
    }

    /**
     *
     */
    initDragAndDrop(onDragStart, onDragEnd) {

        let currentSequence;
        let sequences = document.querySelectorAll('#SequenceSettings .sequence');
        this.node.addEventListener('dragstart', (e) => {
            let enabledKey = getSampleEnabledKey(this.index);
            if (!this.enabled) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
            e.dataTransfer.setData('text/plain', enabledKey);
            e.dataTransfer.dropEffect = 'link';
            e.dataTransfer.effectAllowed = 'link';

            e.dataTransfer.setDragImage(new Image(0, 0), 0, 0);
            onDragStart();
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
                let seq = HC.numberExtract(currentSequence.getAttribute('data-sequence'), 'sequence');
                onDragEnd(seq, this.index);
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
     */
    initEvents() {
        HC.EventManager.register(EVENT_THUMB_UPDATE, this.index, (config) => {
            this.update(config);
        });
        HC.EventManager.register(EVENT_CLIP_LOADED, this.index, (config) => {
            this.update(config);
        });
    }

    /**
     *
     * @param config
     */
    update(config) {
        let sampleKey = getSampleKey(this.index);
        let data = config[sampleKey];

        if (data && data.thumbs) {
            let src = data.thumbs[Math.round(data.thumbs.length / 2)].src;
            this.node.style.backgroundImage = 'url(' + src + ')';
            this.node.style.backgroundPositionX = 'center';
            this.node.style.backgroundPositionY = 'center';
            this.node.setAttribute('data-label', 'ready');
            this.enabled = true;

        } else {
            this.enabled = false;
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
            this.node.style.background = 'linear-gradient(90deg, #2fa1d6, #2fa1d6 ' + prc + '%, black, black 0%)';
        }
    }

    /**
     *
     * @private
     */
    _onResize() {
        let el = document.getElementById('sample' + this.index);
        let ow = el.parentNode.parentNode.clientWidth;
        let nh = (ow / 5 * 9 / 16);
        el.style.height = nh + 'px';
    }
}

export {SampleUi}