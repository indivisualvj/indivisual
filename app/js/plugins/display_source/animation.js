/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{

    HC.SourceManager.display_source.animation = class Plugin extends HC.SourceManager.DisplaySourcePlugin {

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
