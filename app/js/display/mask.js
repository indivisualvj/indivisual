/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     * // fixme inject animation
     * @type {HC.Mask}
     */
    HC.Mask = class Mask {

        /**
         *
         * @param prefix
         * @param canvas
         * @param type
         * @param config
         */
        constructor(prefix, canvas, type, config) {
            this.index = numberExtract(prefix, 'display');
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
        }

        /**
         *
         */
        init() {

            if (this.width && this.height) {
                let w = this.canvas.width;
                let h = this.canvas.height;
                let cx = w / 2;
                let cy = h / 2;

                let x = cx - this.width / 2;
                let y = cy - this.height / 2;

                this.points = [
                    x, y, x + this.width, y, x + this.width, y + this.height, x, y + this.height
                ];

            } else {
                this.points = [];

                let seg = Math.PI * 2 / this.sides;
                let hseg = 0 - Math.PI * 0.5;
                let w = this.canvas.width;
                let h = this.canvas.height;
                let cx = w / 2;
                let cy = h / 2;
                let r = Math.min(cx, cy);

                for (let i = 0; i < this.sides; i++) {
                    let cos = Math.cos(hseg + seg * i);
                    let sin = Math.sin(hseg + seg * i);

                    let x = cx + cos * r;
                    let y = cy + sin * r;

                    this.points.push(x);
                    this.points.push(y);
                }
            }

            // close path
            this.points.push(this.points[0]);
            this.points.push(this.points[1]);

            this.update();
        }

        /**
         *
         */
        update() {

            this.background.width = this.canvas.width;
            this.background.height = this.canvas.height;
            this.canvas.style.webkitClipPath = '';
            this.canvas.width = this.canvas.width;

            // bounds
            let x1 = this.canvas.width;
            let y1 = this.canvas.height;
            let x2 = 0;
            let y2 = 0;

            for (let i = 0; i < this.points.length; i += 2) {
                let x = this.points[i];
                let y = this.points[i + 1];

                x1 = Math.min(x, x1);
                y1 = Math.min(y, y1);
                x2 = Math.max(x, x2);
                y2 = Math.max(y, y2);
            }
            x1 -= 1;
            y1 -= 1;
            x2 += 1;
            y2 += 1;

            let w = x2 - x1;
            let h = y2 - y1;
            this.bounds = new HC.Rectangle(x1, y1, w, h);

            // if (!statics.DisplaySettings.clip_context) {
                let clipPath = this.points.join(', ');
                clipPath = 'polygon(' + clipPath.replace(/([^,]+), ([^,]+)/gi, '$1px $2px') + ')';
                this.canvas.style.webkitClipPath = clipPath;

            // } else {
            //     let _paint = function (points, ctx) {
            //         ctx.beginPath();
            //         ctx.moveTo(points[0], points[1]);
            //         for (let i = 2; i < points.length; i += 2) {
            //             ctx.lineTo(points[i], points[i + 1]);
            //         }
            //         ctx.closePath();
            //     };
            //
            //     _paint(this.points, this.background.ctx);
            //     this.background.ctx.fillStyle = statics.DisplaySettings.background;
            //     this.background.ctx.fill();
            //
            //     _paint(this.points, this.ctx);
            //     this.ctx.clip();
            //     this.canvas._clipped = true;
            // }
        }
    }
}
