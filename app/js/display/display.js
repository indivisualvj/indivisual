/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Display}
     */
    HC.Display = class Display {

        /**
         * @type {HC.Animation}
         */
        animation;

        /**
         * @type {HC.Config}
         */
        config;

        /**
         * @type {HC.DisplayManager}
         */
        displayManager;

        /**
         * 
         * @type {HC.Mask}
         */
        mask;
        /**
         * 
         * @type {boolean}
         */
        smear = false;
        /**
         * 
         * @type {number}
         */
        blitz = 0;
        /**
         * 
         * @type {boolean}
         */
        judder = false;
        /**
         * 
         * @type {boolean}
         */
        visible = true;
        /**
         * 
         * @type {boolean}
         */
        offline = false;
        /**
         * 
         * @type {boolean}
         */
        transparent = false;
        /**
         * 
         * @type {boolean}
         */
        keepbounds = true;
        /**
         * 
         * @type {number}
         */
        smearing = 0.0;
        /**
         * 
         * @type {boolean}
         * @private
         */
        _dirty = true;

        /**
         * @type {HC.Rectangle}
         */
        _bounds;

        /**
         * @type {Array}
         */
        _points;

        /**
         *
         * @type {HC.SourceManager.DisplaySourcePlugin}
         * @private
         */
        _source;

        /**
         * 
         * @param {HC.Animation} animation
         * @param index
         */
        constructor(animation, index) {
            this.animation = animation;
            this.config = animation.config;
            this.displayManager = animation.displayManager;
            this.index = index;
            this.id = 'display' + index;
            let canvas = document.createElement('canvas');
            canvas.id = this.id;
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d', {antialias: false});
            canvas.ctx = this.ctx;
        }

        /**
         *
         * @param source
         */
        setSource(source) {
            this._source = source;
            this.updateClip();
        }

        /**
         *
         * @returns {boolean|*}
         */
        getSource() {
            return this._source;
        }

        /**
         *
         * @returns {HTMLElement}
         */
        current() {
            return this.canvas;
        }

        /**
         *
         * @param fallback
         */
        render(fallback) {
            let ctx = this.ctx;
            let bounds = this._clipBounds(false);
            let clip = bounds;

            if (this.clip) {
                clip = this.clip;
            }

            let image = this._source ? this._source.current(fallback) : fallback;
            let smearing = this.smear ? 1 : Math.max(this.config.DisplaySettings.smearing, this.smearing);

            if (bounds && smearing == 0 || !image) {
                this.clear(bounds);
            }

            let br = this.brightness();
            if (smearing > 0) {
                br -= smearing * (1.0 - this.config.DisplaySettings.transparency);

                ctx.globalAlpha = Math.max(0.02, 1.0 - smearing) * this.config.DisplaySettings.transparency;
                ctx.fillStyle = this.config.DisplaySettings.background;
                ctx.fillRect(
                    bounds.x, bounds.y, bounds.width, bounds.height
                );
            }

            if (image) {
                ctx.globalAlpha = br;
                ctx.drawImage(image,
                    clip.x, clip.y, clip.width, clip.height,
                    bounds.x, bounds.y, bounds.width, bounds.height
                );
                this._dirty = true;
            }

            if (this.blitz > 0) {
                let color = '#00ffbb';
                if (image && image._color) {
                    color = image._color;
                    color = hslToHex(hslComplementary(hexToHsl(color)));
                }

                ctx.fillStyle = color;
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = this.blitz / 3 * this.brightness();
                ctx.fillRect(
                    bounds.x, bounds.y, bounds.width, bounds.height
                );
                ctx.fillStyle = '#000000';
                this._dirty = true;
            }
        }

        /**
         *
         * @param bounds
         */
        clear(bounds) {
            if (this._dirty) {
                bounds = bounds || this._clipBounds();
                this.ctx.clearRect(bounds.x, bounds.y, bounds.width, bounds.height);
                // if (!this.transparent && this.config.DisplaySettings.clip_context && this.mask) {
                //     this.ctx.drawImage(this.mask.background, 0, 0);
                // }
                this._dirty = false;
            }
        }

        /**
         *
         * @param keepbounds
         * @returns {*}
         * @private
         */
        _clipBounds(keepbounds) {
            return !this.mask || keepbounds ? this._bounds : this.mask.bounds;
        }

        /**
         *
         * @returns {HTMLElement|*}
         */
        target() {
            return this.canvas;
        }

        /**
         *
         * @returns {*|number}
         */
        brightness() {
            return this.displayManager.brightness();
        }

        /**
         *
         * @returns {boolean|*}
         */
        bounds() {
            return this._bounds;
        }

        /**
         *
         * @param width
         * @param height
         */
        update(width, height, settings) {

            if (this.isFixedSize()) {
                let b = this._source.bounds();
                width = b.width;
                height = b.height;
            }

            if (!this._bounds || this.canvas.width != width || this.canvas.height != height) {
                this.canvas.width = width;
                this.canvas.height = height;
                this._bounds = new HC.Rectangle(0, 0, width, height);
            }

            this.canvas.style.zIndex = settings[this.id + '_zindex'];
            this.static = settings[this.id + '_static'];
            this.noborder = settings[this.id + '_noborder'];
            this.keepbounds = settings[this.id + '_keepbounds'];
            this.smearing = settings[this.id + '_smearing'];
            this.transparent = settings[this.id + '_transparent'];

            this.ctx.globalAlpha = this.displayManager.brightness();
        }

        /**
         *
         * @returns {boolean}
         */
        getSetBackground() {

            if (this.transparent) {
                return false; // durchsichtig

            // } else if (this.config.DisplaySettings.clip_context && this.mask) {
            //     return false; // mask.background
            }

            return true;
        }

        /**
         *
         * @returns {*}
         */
        width() {
            return this.canvas.width;
        }

        /**
         *
         * @returns {*}
         */
        height() {
            return this.canvas.height;
        }

        /**
         *
         * @returns {number[]}
         */
        points() {
            return [0, 0, this.canvas.width, 0, this.canvas.width, this.canvas.height, 0, this.canvas.height, 0, 0];
        }

        /**
         *
         * @returns {*}
         */
        updateMask() {

            let canvas = this.canvas;
            let prefix = canvas.id + '_mask';

            let sh = false;

            switch (this.config.DisplaySettings[prefix + '_shape']) {

                default:
                    sh = false;
                    break;

                case 'triangle':
                    sh = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 3});
                    break;

                case 'trianglesquare':
                    sh = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 3});
                    break;

                case 'rect':
                    sh = new HC.Mask(this.id, this.canvas, 'rect');
                    break;

                case 'quad':
                    let m = Math.min(this.canvas.width, this.canvas.height);
                    sh = new HC.Mask(this.id, this.canvas, 'rect', {width: m, height: m});
                    break;

                case 'pentagon':
                    sh = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 5});
                    break;

                case 'hexagon':
                    sh = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 6});
                    break;

                case 'octagon':
                    sh = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 8});
                    break;

                case 'decagon':
                    sh = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 10});
                    break;

                case 'dodecagon':
                    sh = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 12});
                    break;

                case 'hectagon':
                    sh = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 16});
                    break;

                case 'icosagon':
                    sh = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 30});
                    break;
            }

            if (sh) {
                this._points = false;

            } else {
                this.canvas.style.webkitClipPath = '';
                this.canvas.width = this.canvas.width;
                this._points = this.points();
            }
            this.mask = sh;

            this.canvas.style.background = this.getSetBackground() ? this.config.DisplaySettings.background : 'none';

            return sh;
        }

        /**
         *
         */
        updateClip() {
            if (this._source) {
                let ob = this._clipBounds(true);
                let mb = this._clipBounds(false);
                let sb = this._source.bounds();
                if (sb && mb) {
                    // quelle hat eine eigene und unveränderliche größe
                    let dx = (ob.width - sb.width) / 2;
                    let dy = (ob.height - sb.height) / 2;

                    let clip = new HC.Rectangle(mb.x - dx, mb.y - dy, mb.width, mb.height);
                    this.clip = clip;

                } else {
                    this.clip = false;
                }
            }
        }

        /**
         *
         * @returns {boolean}
         */
        isFixedSize() {
            if (this._source) {
                let sb = this._source.bounds();
                if (sb) {
                    return true;
                }
            }
            return false;
        }

        /**
         *
         */
        loadMask() {
            if (this.mask) {
                let mask = this.mask;
                let stored = this.config.DisplaySettings[mask.id];
                if (stored) {
                    try {
                        stored = JSON.parse(stored);
                        if ((stored.points.length - 2) / 2 == mask.sides) {
                            mask.points = stored.points;
                            mask.update();

                        } else {
                            mask.init();
                        }

                        mask.update();

                    } catch (e) {

                    }
                } else {
                    mask.init();
                }
            }
        }

        /**
         *
         * @returns {{sourcePoints: *[], targetPoints: *[]}}
         */
        loadMapping() {
            let bounds = this._clipBounds(this.keepbounds);
            let points = this._getMaptasticPoints(bounds);
            let sourcePoints = points;
            let targetPoints = false;
            let stored = this.getMapping();
            if (stored) {
                try {
                    let mapping = JSON.parse(stored);
                    targetPoints = mapping.targetPoints;
                } catch (e) {
                }
            }

            return {
                sourcePoints: sourcePoints,
                targetPoints: targetPoints
            };
        }

        /**
         *
         * @returns {*}
         */
        getMapping() {
            return this.config.DisplaySettings[this.id + '_mapping'];
        }

        /**
         *
         * @param points
         * @returns {*[]}
         * @private
         */
        _getMaptasticPoints(points) {
            let l = points.x;
            let t = points.y;
            let r = points.width + points.x;
            let b = points.height + points.y;

            let bounds = [
                [l, t],
                [r, t],
                [r, b],
                [l, b]
            ];

            return bounds;
        }

        /**
         *
         * @param lineWidth
         * @param color
         * @param mode
         * @param speed
         */
        drawBorder(lineWidth, color, mode, speed) {

            let ctx = this.ctx;
            let points = this.mask ? this.mask.points : this._points;
            if (!points) {
                return;
            }

            let prc = false;
            if (speed === false) {
                prc = this.displayManager.audioAnalyser.volume * 2;
            } else {
                prc = speed.prc;
            }

            ctx.globalAlpha = this.displayManager.brightness();
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth * 2;

            let pc = points.length / 2;

            if (pc > 1) {
                HC.Display.border_mode[mode].apply(ctx, points, pc, speed, prc);
                this._dirty = true;
            }
        }
    }
}
