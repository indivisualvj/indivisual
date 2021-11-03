/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
HC.Display.border_mode = {};
{
    /**
     *
     * @type {HC.Display.BorderModePlugin}
     */
    HC.Display.BorderModePlugin = class BorderModePlugin {

        static index = 99;

        /**
         * @type {HC.DisplayManager}
         */
        displayManager;

        /**
         *
         * @param {HC.DisplayManager} displayManager
         */
        constructor(displayManager) {
            this.displayManager = displayManager;
        }

        /**
         *
         */
        init() {

        }

        /**
         *
         * @param array
         * @returns {any[]}
         */
        points_reverse(array) {
            let length = array.length;
            let nu = new Array(length);

            for (let i = 0; i < length; i += 2) {
                nu[i] = array[length - 2 - i];
                nu[i + 1] = array[length - 2 - i + 1];
            }
            return nu;
        }
    }
}
