/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OffsetModePlugin} from "../OffsetModePlugin";

class sphere extends OffsetModePlugin {
    static name = 'sphere';

    apply(shape) {
        let layer = this.layer;
        let pos = layer.getPatternPlugin().patternCenterVector(true);

        let a = shape.position().distanceTo(pos);
        let m = a * layer.shapeSize(.01);
        let x = this.settings.offset_x * m;
        let y = this.settings.offset_y * m;
        let z = this.settings.offset_z * m;

        shape.offset(x, y, z);

    }
}

export {sphere};
