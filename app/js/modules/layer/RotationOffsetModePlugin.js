/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../AnimationPlugin";

class RotationOffsetModePlugin extends AnimationPlugin {

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.rotation.properties;
    }

}

export {RotationOffsetModePlugin};
