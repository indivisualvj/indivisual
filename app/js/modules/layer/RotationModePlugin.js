/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../../shared/AnimationPlugin";

class RotationModePlugin extends AnimationPlugin {
    injections = {
        current: {
            x: 0,
            y: 0,
            z: 0
        },
        next: {
            x: 0,
            y: 0,
            z: 0
        },
        tween: false,
        iterations: 0
    };

    isFirstShape(shape) {
        return shape.index === -1;
    }

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.rotation.properties;
    }
}

export {RotationModePlugin};
