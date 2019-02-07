/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

(function () {
    /**
     *
     * @param prefix
     * @param canvas
     * @param type
     * @param config
     * @constructor
     */
    HC.Mask = function (prefix, canvas, type, config) {
        this.index = number_extract(prefix, 'display');
        this.id = prefix + '_mask';
        this.ctx = canvas.ctx;
        this.canvas = canvas;
        this.type = type;

        this.background = document.createElement('canvas');
        this.background.ctx = this.background.getContext('2d', {antialias: ANTIALIAS});

        if (config) {
            if ('width' in config) {
                this.sides = 4;
                this.width = config.width;
            }
            if ('height' in config) {
                this.sides = 4;
                this.height = config.height;
            }
            if ('sides' in config) {
                this.sides = config.sides;
            }
        } else {
            this.sides = 4;
            this.width = this.ctx.canvas.width;
            this.height = this.ctx.canvas.height;
        }
        this.points = false;
    };

    HC.Mask.prototype = {

        /**
         *
         */
        init: function () {

            if (this.width && this.height) {
                var w = this.canvas.width;
                var h = this.canvas.height;
                var cx = w / 2;
                var cy = h / 2;

                var x = cx - this.width / 2;
                var y = cy - this.height / 2;

                this.points = [
                    x, y, x + this.width, y, x + this.width, y + this.height, x, y + this.height
                ];

            } else {
                this.points = [];

                var seg = Math.PI * 2 / this.sides;
                var hseg = 0 - Math.PI * 0.5;
                var w = this.canvas.width;
                var h = this.canvas.height;
                var cx = w / 2;
                var cy = h / 2;
                var r = Math.min(cx, cy);

                for (var i = 0; i < this.sides; i++) {
                    var cos = Math.cos(hseg + seg * i);
                    var sin = Math.sin(hseg + seg * i);

                    var x = cx + cos * r;
                    var y = cy + sin * r;

                    this.points.push(x);
                    this.points.push(y);
                }
            }

            // close path
            this.points.push(this.points[0]);
            this.points.push(this.points[1]);

            this.update();
        },

        /**
         *
         */
        update: function () {

            this.background.width = this.canvas.width;
            this.background.height = this.canvas.height;
            this.canvas.style.webkitClipPath = '';
            this.canvas.width = this.canvas.width;

            // bounds
            var x1 = this.canvas.width;
            var y1 = this.canvas.height;
            var x2 = 0;
            var y2 = 0;

            for (var i = 0; i < this.points.length; i+=2) {
                var x = this.points[i];
                var y = this.points[i+1];

                x1 = Math.min (x, x1);
                y1 = Math.min (y, y1);
                x2 = Math.max (x, x2);
                y2 = Math.max (y, y2);
            }
            x1 -= 1;
            y1 -= 1;
            x2 += 1;
            y2 += 1;

            var w = x2 - x1;
            var h = y2 - y1;
            this.bounds = new HC.Rectangle(x1, y1, w, h);

            if (!statics.DisplaySettings.clip_context) {
                var clipPath = this.points.join(', ');
                clipPath = 'polygon(' + clipPath.replace(/([^,]+), ([^,]+)/gi, '$1px $2px') + ')';
                this.canvas.style.webkitClipPath = clipPath;

            } else {
                var _paint = function (points, ctx) {
                    ctx.beginPath();
                    ctx.moveTo(points[0], points[1]);
                    for (var i = 2; i < points.length; i+=2) {
                        ctx.lineTo(points[i], points[i+1]);
                    }
                    ctx.closePath();
                };

                _paint(this.points, this.background.ctx);
                this.background.ctx.fillStyle = statics.DisplaySettings.clearcolor;
                this.background.ctx.fill();

                _paint(this.points, this.ctx);
                this.ctx.clip();
                this.canvas._clipped = true;
            }
        }
    };

}());
