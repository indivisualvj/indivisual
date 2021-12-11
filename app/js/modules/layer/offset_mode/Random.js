/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OffsetModePlugin} from "../OffsetModePlugin";

class random extends OffsetModePlugin {
    static name = 'random';
    injections = {
        value: false
    };

    apply(shape) {
        let layer = this.layer;

        let params = this.params(shape);

        if (!params.value) {
            params.value = (layer.shapeSize(1) / randomFloat(0.1, 1, 2, true));
        }

        let m = params.value;
        let x = this.settings.offset_x * m;
        let y = this.settings.offset_y * m;
        let z = this.settings.offset_z * m;

        shape.offset(x, y, z);

    }
}

export {random};
