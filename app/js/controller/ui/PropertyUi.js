/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {Guify} from "./guify/Guify";

class PropertyUi extends Guify {

    /**
     * @type {Config}
     */
    config;

    constructor(id, title, open, config) {
        super(id, title, open);
        this.config = config;
    }

    addControllers(controlSets, uiClass, parent) {
        this._addControllers(controlSets, uiClass, parent);
    }

    _addControllers(controlSets, uiClass, parent) {
        parent = parent || this;
        for (let k in controlSets) {
            let controlSet = controlSets[k];

            if (controlSet.visible !== false) {
                let ui = new uiClass(controlSet, parent);

                if (controlSet instanceof HC.IterableControlSet) {
                    ui.folder = parent;

                } else {
                    ui.addFolder();
                }
                ui.addControllers();
            }
        }
    }
}

export {PropertyUi}