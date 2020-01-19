/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
(function () {
    /**
     *  todo ES6
     * @param instance
     * @param width
     * @param height
     * @constructor
     */
    HC.Source = function (instance, width, height) {
        this.instance = instance;
        this.type = this.instance.type;
        this.width = width;
        this.height = height;
    };

    HC.Source.prototype = {

        /**
         *
         * @param fallback
         * @param passthrough
         * @returns {*|HTMLElement|*|boolean|*}
         */
        current: function (fallback, passthrough) {
            return this.instance.current(fallback, passthrough);
        },

        /**
         *
         * @param reference
         * @returns {*}
         */
        bounds: function (reference) {
            return this.instance.bounds(reference);
        }

    };
}());
