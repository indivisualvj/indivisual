/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{

    HC.SourceManager.display_source.black = class Plugin extends HC.SourceManager.DisplaySourcePlugin {

        static index = 40;

        /**
         *
         * @type {string}
         */
        type = 'color';

        /**
         *
         * @param width
         * @param height
         */
        update(width, height) {
            let checkWidth = this.width !== width;
            let checkHeight = this.height !== height;
            let needsUpdate = checkWidth || checkHeight;
            this.width = width;
            this.height = height;

            if (needsUpdate) {
                this.init(this.index);
            }
        }

        /**
         *
         */
        init(index) {
            this.index = index;
            this.id = this.type + this.index;

            if (!this.canvas) {
                this.canvas = new OffscreenCanvas(1, 1);
                this.canvas.ctx = this.canvas.getContext('2d');
            }
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.canvas.ctx.fillStyle = '#000000';
            this.canvas.ctx.fillRect(0, 0, this.width, this.height);

            this.canvas.id = this.id + this.canvas.ctx.fillStyle;
        }

        /**
         *
         * @param fallback
         * @returns {HTMLCanvasElement}
         */
        current(fallback) {
            return this.canvas;
        }

    }

}
