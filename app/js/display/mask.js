/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
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

            this.canvas.style.clipPath = '';
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

            let clipPath = this.points.join(', ');
            clipPath = 'polygon(' + clipPath.replace(/([^,]+), ([^,]+)/gi, '$1px $2px') + ')';
            this.canvas.style.clipPath = clipPath;
        }
    }
}
