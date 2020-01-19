/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Source}
     */
    HC.Source = class Source {

        /**
         *
         * @param instance
         * @param width
         * @param height
         */
        constructor(instance, width, height) {
            this.instance = instance;
            this.type = this.instance.type;
            this.width = width;
            this.height = height;
        }

        /**
         *
         * @param fallback
         * @param passthrough
         * @returns {*|HTMLElement|*|boolean|*}
         */
        current(fallback, passthrough) {
            return this.instance.current(fallback, passthrough);
        }

        /**
         *
         * @param reference
         * @returns {*}
         */
        bounds(reference) {
            return this.instance.bounds(reference);
        }
    }
}
