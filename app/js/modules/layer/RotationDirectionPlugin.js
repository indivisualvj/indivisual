/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../AnimationPlugin";

class RotationDirectionPlugin extends AnimationPlugin {
    injections = {
        dir: 0,
        directions: {
            x: 0,
            y: 0,
            z: 0
        }
    };
    switcher = false;

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.rotation.properties;
    }

    isFirstShape(shape) {
        return shape.index === -1;
    }
}

export {RotationDirectionPlugin};
