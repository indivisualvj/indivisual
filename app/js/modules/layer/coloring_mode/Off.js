/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ColoringModePlugin} from "../ColoringModePlugin";

class off extends ColoringModePlugin {
    static name = 'off';
    static index = 1;

    apply(shape) {
        let c = shape.color;
        c.h = 0;
        c.s = 100;
        c.l = 50;
    }
}

export {off};
