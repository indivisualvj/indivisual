/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{

    HC.Display = class Display {

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
         * @type {number}
         */
        smearing = 0.0;

        /**
         * 
         * @type {boolean}
         * @private
         */
        _dirty;

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
         * @param index
         * @param {HC.DisplayManager} displayManager
         */
        constructor(index, displayManager) {
            this.config = displayManager.config;
            this.displayManager = displayManager;
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
            let bounds = this.getBounds();

            let image = this._source ? this._source.current(fallback) : fallback;
            let smearing = this.smear ? 1 : Math.max(this.config.DisplaySettings.smearing, this.smearing);

            if (smearing === 0 || !image) {
                this.clear();
            }

            let br = this.brightness();
            if (smearing > 0) {
                br -= smearing * (1.0 - this.config.DisplaySettings.transparency);

                ctx.globalAlpha = Math.max(0.02, 1.0 - smearing) * this.config.DisplaySettings.transparency;
                ctx.fillStyle = this.config.DisplaySettings.background;
                ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            }

            if (image) {
                ctx.globalAlpha = br;
                ctx.drawImage(image,
                    this.clip.x, this.clip.y, this.clip.width, this.clip.height,
                    this.clip.x, this.clip.y, bounds.width, bounds.height);
                this._dirty = true;
            }

            if (this.blitz > 0) {
                let color = '#00ffbb';
                if (image && image._color) {
                    color = image._color;
                    color = HC.hslToHex(HC.hslComplementary(HC.hexToHsl(color)));
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
         */
        clear() {
            if (this._dirty) {
                let bounds = this.clip;
                this.ctx.clearRect(bounds.x, bounds.y, bounds.width, bounds.height);
                this._dirty = false;
            }
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
         * @param settings
         */
        update(width, height, settings) {

            if (!this._bounds || this.canvas.width !== width || this.canvas.height !== height) {
                this.canvas.width = width;
                this.canvas.height = height;
                this._bounds = new HC.Rectangle(0, 0, width, height);
            }

            this.canvas.style.zIndex = settings[this.id + '_zindex'];
            this.static = settings[this.id + '_static'];
            this.noborder = settings[this.id + '_noborder'];
            this.smearing = settings[this.id + '_smearing'];
            this.transparent = settings[this.id + '_transparent'];

            this.ctx.globalAlpha = this.displayManager.brightness();
        }

        /**
         *
         * @returns {boolean}
         */
        getSetBackground() {
            return !this.transparent;
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

            let mask;

            switch (this.config.DisplaySettings[prefix + '_shape']) {

                default:
                    mask = false;
                    break;

                case 'triangle':
                    mask = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 3});
                    break;

                case 'trianglesquare':
                    mask = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 3});
                    break;

                case 'rect':
                    mask = new HC.Mask(this.id, this.canvas, 'rect');
                    break;

                case 'quad':
                    let m = Math.min(this.canvas.width, this.canvas.height);
                    mask = new HC.Mask(this.id, this.canvas, 'rect', {width: m, height: m});
                    break;

                case 'pentagon':
                    mask = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 5});
                    break;

                case 'hexagon':
                    mask = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 6});
                    break;

                case 'octagon':
                    mask = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 8});
                    break;

                case 'decagon':
                    mask = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 10});
                    break;

                case 'dodecagon':
                    mask = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 12});
                    break;

                case 'hectagon':
                    mask = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 16});
                    break;

                case 'icosagon':
                    mask = new HC.Mask(this.id, this.canvas, 'polygon', {sides: 30});
                    break;
            }

            if (mask) {
                this._points = null;
                mask.init();

            } else {
                this.canvas.style.clipPath = '';
                this._points = this.points();
            }
            this.mask = mask;

            this.canvas.style.background = this.getSetBackground() ? this.config.DisplaySettings.background : 'none';

            this.updateClip();

            return mask;
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
                        if ((stored.points.length - 2) / 2 === mask.sides) {
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

            this.updateClip();
        }

        getBounds() {
            return this.mask ? this.mask.bounds : this._bounds;
        }

        updateClip() {
            let bounds = this.getBounds();
            this.clip = new HC.Rectangle(bounds.x, bounds.y, bounds.width, bounds.height);
        }

        /**
         *
         * @returns {{sourcePoints: *[], targetPoints: *[]}}
         */
        loadMapping() {
            let bounds = this._bounds;
            let sourcePoints = this._getMaptasticPoints(bounds);
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

            let prc;
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
