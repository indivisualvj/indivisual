/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {LightingPatternPlugin} from "../LightingPatternPlugin";

class shape extends LightingPatternPlugin {
    static name = 'within shape';

    apply(light, sides) {
        let layer = this.layer;

        let index = light.userData.index;
        let shape = layer.getShape(index);
        if (shape) {
            shape.getWorldPosition(light.position);
            light.translateX(layer.cameraDefaultDistance(.25) * this.settings.lighting_pattern_centerx);
            light.translateY(layer.cameraDefaultDistance(.25) * this.settings.lighting_pattern_centery);
            light.translateZ(layer.cameraDefaultDistance(.25) * this.settings.lighting_pattern_centerz);
        }
    }
}

export {shape};
