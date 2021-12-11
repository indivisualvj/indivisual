/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeTransformPlugin} from "../ShapeTransformPlugin";

class off extends ShapeTransformPlugin {
    static index = 1;
    static name = 'off';

    apply(shape) {

    }

    _doesThings() {
        return false;
    }
}

export {off}