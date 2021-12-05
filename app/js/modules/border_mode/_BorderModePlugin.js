/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ModulePlugin} from "../../shared/ModulePlugin";

class BorderModePlugin extends ModulePlugin {

    static plugins;

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

    /**
     *
     */
    init(plugins) {
        BorderModePlugin.plugins = plugins;
    }

    apply (ctx, points, pc, speed, prc) {

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
