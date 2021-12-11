/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../AnimationPlugin";

class ShapeLookatPlugin extends AnimationPlugin {
    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.locking.properties;
    }

    before(shape) {
        let pattern = this.layer.getPatternPlugin();
        if (pattern.shared && pattern.shared.locking && pattern.shared.locking.disabled) {
            return false;
        }
    }

    centerVector() {
        let v = this.layer.cameraDefaultDistance();
        return new THREE.Vector3(
            v * this.settings.shape_lookat_centerx,
            v * this.settings.shape_lookat_centery,
            v * this.settings.shape_lookat_centerz
        );
    }

}

export {ShapeLookatPlugin};
