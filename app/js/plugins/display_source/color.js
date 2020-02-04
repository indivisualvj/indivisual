/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.SourceManager.display_source.Color}
     */
    HC.SourceManager.display_source.color = class Color extends HC.SourceManager.DisplaySourcePlugin {

        type = 'color';

        _bounds;

        /**
         *
         * @param width
         * @param height
         */
        update(width, height) {
            let checkWidth = this.width != width;
            let checkHeight = this.height != height;
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
            this._bounds = false;

            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.ctx = this.canvas.getContext('2d');
            }
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.canvas.ctx.fillStyle = '#afafaf';
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