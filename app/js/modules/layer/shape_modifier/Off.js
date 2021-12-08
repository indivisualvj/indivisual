/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeModifierPlugin} from "../ShapeModifierPlugin";

class off extends ShapeModifierPlugin {
    static index = 1;
    static name = 'off';

    create(geometry) {
        return geometry;
    }
}

export {off};
