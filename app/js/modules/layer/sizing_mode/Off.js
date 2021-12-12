/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {SizingModePlugin} from "../SizingModePlugin";

class off extends SizingModePlugin {
    static index = 1;
    static name = 'off';

    apply(shape) {
        let s = 1;
        s *= this.settings.sizing_scale;
        let x = this.settings.sizing_x * s;
        let y = this.settings.sizing_y * s;
        let z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
}

export {off};
