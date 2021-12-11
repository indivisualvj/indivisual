/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../../shared/AnimationPlugin";

class SizingFlipPlugin extends AnimationPlugin {

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.sizing.properties;
    }

}

export {SizingFlipPlugin}
