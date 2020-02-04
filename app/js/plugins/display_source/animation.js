/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.SourceManager.display_source.Animation}
     */
    HC.SourceManager.display_source.animation = class Animation extends HC.SourceManager.DisplaySourcePlugin {

        /**
         *
         * @param fallback
         * @param passthrough
         * @returns {*|HTMLElement|*|boolean|*}
         */
        current(fallback, passthrough) {
            return this.renderer.current();
        }

    }
}
