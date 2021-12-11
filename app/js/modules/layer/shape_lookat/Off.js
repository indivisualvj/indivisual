/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeLookatPlugin} from "../ShapeLookatPlugin";

class off extends ShapeLookatPlugin {
    static index = 1;

    apply(shape) {
        shape.sceneObject().rotation.set(0, 0, 0);
        shape.getMesh().rotation.set(0, 0, 0);
    }
}

export {off};
