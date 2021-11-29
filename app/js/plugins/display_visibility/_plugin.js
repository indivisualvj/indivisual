/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.Display.display_visibility = {};

{
    HC.Display.VisibilityModePlugin = class VisibilityModePlugin {

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
         */
        doFirstItemStuff() {
        }

        getDisplay(i) {
            let number = this.displayManager.displayMap[i];
            if (number !== undefined) {
                return this.displayManager.getDisplay(number);
            }

            return null;
        }

        getSpeed() {
            return this.displayManager.displaySpeed();
        }

        /**
         *
         * @param {HC.Display} display
         */
        apply(display) {

        }

        /**
         *
         * @param {HC.Display} display
         * @returns {boolean}
         */
        before (display) {

            if (display.index === 0) {
                this.doFirstItemStuff();
            }

            if (display.static) {
                display.visible = true;
                display.blitz = false;
                display.smear = false;
                display.judder = false;
                return false;
            }

            display.visible = true;
            display.blitz = false;
            display.smear = false;
            display.judder = false;

            return true;
        }

    }
}
