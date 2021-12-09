/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeLookatPlugin} from "../ShapeLookatPlugin";

class camera extends ShapeLookatPlugin {
    static index = 4;

    apply(shape) {
        let vector = this.layer.getCamera().position;
        shape.lookAt(vector);
    }
}

export {camera};
