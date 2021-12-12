/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../AnimationPlugin";

class FilterModePlugin extends AnimationPlugin {
    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.filter.properties;
    }

    before(shape) {
        // let locked = this.shapeFilterModeLocked(shape);
        // if (locked) {
        //     return false;
        // }
    }

    // shapeFilterModeLocked(shape, enabled) {
    //     if (shape) {
    //         let plugin = this.layer.getFilterModePlugin();
    //         let params = plugin.params(shape);
    //         if (enabled !== undefined) {
    //             params.__locked = enabled;
    //         }
    //         return params.__locked;
    //     }
    //
    //     return false;
    // }
}

export {FilterModePlugin}
