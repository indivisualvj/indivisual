/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.SourceManager.display_source.Display}
     */
    HC.SourceManager.display_source.display = class Display extends HC.SourceManager.DisplaySourcePlugin {

        type = 'display';

        cacheable = false;

        init(index) {
            this.index = index;
        }

        update(width, height) {
            this.display = this.sourceManager.getDisplay(this.index);
        }

        current(fallback, passthrough) {
            return this.display.current();
        }

        /**
         *
         * @param reference
         * @returns {*}
         */
        bounds(reference) {
            return this.display.bounds();
        }
    }
}
