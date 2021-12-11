/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OffsetModePlugin} from "../OffsetModePlugin";

class off extends OffsetModePlugin {
    static name = 'off';
    static index = 1;

    apply(shape) {
        let layer = this.layer;
        let m = layer.shapeSize(.5);
        let x = this.settings.offset_x * m;
        let y = this.settings.offset_y * m;
        let z = this.settings.offset_z * m;
        shape.offset(x, y, z);
    }
}

export {off}
