/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function () {
    /**
     *
     * @param index
     * @constructor
     */
    HC.Display = function (index) {
        this.index = index;
        this.id = 'display' + index;
        var canvas = document.createElement('canvas');
        canvas.id = this.id;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', {antialias: false});
        canvas.ctx = this.ctx;
        this.mask = false;
        this.smear = false;
        this.blitz = 0;
        this.judder = false;
        this.visible = true;
        this.offline = false;
        this.transparent = false;
        this.keepbounds = true;
        this.smearing = 0.0;
        this._bounds = false;
        this._points = false;
        this._dirty = true;
        this._source = false;
    };

    HC.Display.prototype = {

        /**
         *
         * @param source
         */
        setSource: function (source) {
            this._source = source;
            this.updateClip();
        },

        /**
         *
         * @returns {boolean|*}
         */
        getSource: function () {
            return this._source;
        },

        /**
         *
         * @returns {HTMLElement}
         */
        current: function () {
            return this.canvas;
        },

        /**
         *
         * @param fallback
         */
        render: function (fallback) {
            var ctx = this.ctx;
            var bounds = this._clipBounds(false);
            var clip = bounds;

            if (this.clip) {
                clip = this.clip;
            }

            var image = this._source ? this._source.current(fallback) : fallback;
            var smearing = this.smear ? 1 : Math.max(statics.DisplaySettings.smearing, this.smearing);

            if (bounds && smearing == 0 || !image) {
                this.clear(bounds);
            }

            var br = this.brightness();
            if (smearing > 0) {
                br -= smearing * (1.0 - statics.DisplaySettings.transparency);

                ctx.globalAlpha = Math.max(0.02, 1.0 - smearing) * statics.DisplaySettings.transparency;
                ctx.fillStyle = statics.DisplaySettings.background;
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
                var color = '#00ffbb';
                if (image && image._color) {
                    color = image._color;
                    color = hslToHex(hslComplementary(hexTohsl(color)));
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
        },

        /**
         *
         * @param bounds
         */
        clear: function (bounds) {
            if (this._dirty) {
                bounds = bounds || this._clipBounds();
                this.ctx.clearRect(bounds.x, bounds.y, bounds.width, bounds.height);
                if (!this.transparent && statics.DisplaySettings.clip_context && this.mask) {
                    this.ctx.drawImage(this.mask.background, 0, 0);
                }
                this._dirty = false;
            }
        },

        /**
         *
         * @param keepbounds
         * @returns {boolean|*}
         * @private
         */
        _clipBounds: function (keepbounds) {
            return !this.mask || keepbounds ? this._bounds : this.mask.bounds;
        },

        /**
         *
         * @returns {HTMLElement|*}
         */
        target: function () {
            return this.canvas;
        },

        /**
         *
         * @returns {*|number}
         */
        brightness: function () {
            return displayman.brightness();
        },

        /**
         *
         * @returns {boolean|*}
         */
        bounds: function () {
            return this._bounds;
        },

        /**
         *
         * @param width
         * @param height
         */
        update: function (width, height, settings) {

            if (this.isFixedSize()) {
                var b = this._source.bounds();
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

            this.ctx.globalAlpha = displayman.brightness();
        },

        /**
         *
         * @returns {boolean}
         */
        getSetBackground: function () {

            if (this.transparent) {
                return false; // durchsichtig

            } else if (statics.DisplaySettings.clip_context && this.mask) {
                return false; // mask.background
            }

            return true;
        },

        /**
         *
         * @returns {*}
         */
        width: function () {
            return this.canvas.width;
        },

        /**
         *
         * @returns {*}
         */
        height: function () {
            return this.canvas.height;
        },

        /**
         *
         * @returns {number[]}
         */
        points: function () {
            return [0, 0, this.canvas.width, 0, this.canvas.width, this.canvas.height, 0, this.canvas.height, 0, 0];
        },

        /**
         *
         * @returns {*}
         */
        updateMask: function () {

            var canvas = this.canvas;
            var prefix = canvas.id + '_mask';

            var sh = false;

            switch (statics.DisplaySettings[prefix + '_shape']) {

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
                    var m = Math.min(this.canvas.width, this.canvas.height);
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

            this.canvas.style.background = this.getSetBackground() ? statics.DisplaySettings.background : 'none';

            return sh;

        },

        /**
         *
         */
        updateClip: function () {
            if (this._source) {
                var ob = this._clipBounds(true);
                var mb = this._clipBounds(false);
                var sb = this._source.bounds(false);
                if (sb && mb) {
                    // quelle hat eine eigene und unveränderliche größe
                    var dx = (ob.width - sb.width) / 2;
                    var dy = (ob.height - sb.height) / 2;

                    var clip = new HC.Rectangle(mb.x - dx, mb.y - dy, mb.width, mb.height);
                    this.clip = clip;

                } else {
                    this.clip = false;
                }
            }
        },

        /**
         *
         * @returns {boolean}
         */
        isFixedSize: function () {
            if (this._source) {
                var sb = this._source.bounds(false);
                if (sb) {
                    return true;
                }
            }
            return false;
        },

        /**
         *
         */
        loadMask: function () {
            if (this.mask) {
                var mask = this.mask;
                var stored = statics.DisplaySettings[mask.id];
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
        },

        /**
         *
         * @returns {{sourcePoints: *[], targetPoints: *[]}}
         */
        loadMapping: function () {
            var bounds = this._clipBounds(this.keepbounds);
            var points = this._getMaptasticPoints(bounds);
            var sourcePoints = points;
            var targetPoints = false;
            var stored = this.getMapping();
            if (stored) {
                try {
                    var mapping = JSON.parse(stored);
                    targetPoints = mapping.targetPoints;
                } catch (e) {
                }
            }

            return {
                sourcePoints: sourcePoints,
                targetPoints: targetPoints
            };
        },

        /**
         *
         * @returns {*}
         */
        getMapping: function () {
            return statics.DisplaySettings[this.id + '_mapping'];
        },

        /**
         *
         * @param points
         * @returns {*[]}
         * @private
         */
        _getMaptasticPoints: function (points) {
            var l = points.x;
            var t = points.y;
            var r = points.width + points.x;
            var b = points.height + points.y;

            var bounds = [
                [l, t],
                [r, t],
                [r, b],
                [l, b]
            ];

            return bounds;
        },

        /**
         *
         * @param lineWidth
         * @param color
         * @param mode
         * @param speed
         */
        drawBorder: function (lineWidth, color, mode, speed) {

            var ctx = this.ctx;
            var points = this.mask ? this.mask.points : this._points;
            if (!points) {
                return;
            }

            var prc = false;
            if (speed === false) {
                prc = audio.volume * 2;
            } else {
                prc = speed.prc;
            }

            ctx.globalAlpha = displayman.brightness();
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth * 2;

            var pc = points.length / 2;

            if (pc > 1) {
                HC.Display.borderModes[mode](ctx, points, pc, speed, prc);
                this._dirty = true;
            }
        }
    };

})();