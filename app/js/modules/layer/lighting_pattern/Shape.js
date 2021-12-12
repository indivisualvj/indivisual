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
        }
    }
}

export {shape};
