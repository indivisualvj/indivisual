/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{

    HC.SourceManager.display_source.display = class Plugin extends HC.SourceManager.DisplaySourcePlugin {

        type = 'display';

        /**
         *
         * @type {boolean}
         */
        cacheable = false;

        /**
         * @type {HC.Display}
         */
        display;

        init(index) {
            this.index = index;
        }

        /**
         *
         * @param width
         * @param height
         */
        update(width, height) {
            this.display = this.displayManager.getDisplay(this.index);
        }

        /**
         *
         * @param fallback
         * @param passthrough
         * @returns {HTMLElement}
         */
        current(fallback, passthrough) {
            if (this.display) {
                return this.display.current();
            }

            return fallback;
        }

    }
}
