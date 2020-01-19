/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Color}
     */
    HC.Color = class Color {

        constructor(index) {
            this.type = 'Color';
            this.index = index;
            this.id = this.type + this.index;
            this._bounds = false;
        }


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
                this.init();
            }
        }

        /**
         *
         */
        init() {
            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
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
         * @param reference
         * @returns {*}
         */
        bounds(reference) {
            return reference;
        }

        /**
         *
         * @returns {*}
         */
        brightness() {
            return displayman.brightness();
        }

        /**
         *
         * @returns {HTMLElement|*}
         */
        current() {
            return this.canvas;
        }

    }

}