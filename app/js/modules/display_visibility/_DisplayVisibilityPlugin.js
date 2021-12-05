/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ModulePlugin} from "../../js/shared/ModulePlugin";

class DisplayVisibilityPlugin extends ModulePlugin
{
    /**
     * @type {DisplayManager}
     */
    displayManager;

    /**
     *
     * @param {DisplayManager} displayManager
     */
    constructor(displayManager) {
        super();
        this.displayManager = displayManager;
    }

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
     * @param {Display} display
     */
    apply(display) {

    }

    /**
     *
     * @param {Display} display
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
