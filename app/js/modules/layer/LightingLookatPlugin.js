/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../AnimationPlugin";


class LightingLookatPlugin extends AnimationPlugin {

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.lighting_lookat.properties;
    }

    params(light) {
        return light.userData;
    }

    isFirstShape(light) {
        return light.userData.index === 0;
    }

    centerVector() {
        let v = this.layer.cameraDefaultDistance(.25);
        return new THREE.Vector3(
            v * this.settings.lighting_lookat_centerx,
            v * this.settings.lighting_lookat_centery,
            v * this.settings.lighting_lookat_centerz
        );
    }
}

export {LightingLookatPlugin};
