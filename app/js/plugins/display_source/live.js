/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.SourceManager.display_source.live = class Plugin extends HC.SourceManager.DisplaySourcePlugin {
        static index = 1;

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
