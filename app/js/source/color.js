(function () {
    /**
     * todo ES6
     * @param index
     * @constructor
     */
    HC.Color = function (index) {
        this.type = 'Color';
        this.index = index;
        this.id = this.type + this.index;
        this._bounds = false;
    };

    HC.Color.prototype = {

        /**
         *
         * @param width
         * @param height
         */
        update: function (width, height) {
            var checkWidth = this.width != width;
            var checkHeight = this.height != height;
            var needsUpdate = checkWidth || checkHeight;
            this.width = width;
            this.height = height;

            if (needsUpdate) {
                this.init();
            }
        },

        /**
         *
         */
        init: function () {
            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.ctx = this.canvas.getContext('2d');
            }
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.canvas.ctx.fillStyle = '#000000';
            this.canvas.ctx.fillRect(0, 0, this.width, this.height);

            this.canvas.id = this.id + this.canvas.ctx.fillStyle;
        },

        /**
         *
         * @param reference
         * @returns {*}
         */
        bounds: function (reference) {
            return reference;
        },

        /**
         *
         * @returns {*}
         */
        brightness: function () {
            return displayman.brightness();
        },

        /**
         *
         * @returns {HTMLElement|*}
         */
        current: function () {
            return this.canvas;
        }

    };

}());