/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {SizingModePlugin} from "../SizingModePlugin";
import {Vector3} from "three";

class sphere extends SizingModePlugin {
    static name = 'sphere';

    apply(shape, revert) {
        let layer = this.layer;


        let size = this.calculate(shape, revert, layer.getPatternPlugin().patternCenterVector(true));

        shape.scale(size.x, size.y, size.z);
    }

    calculate(shape, revert, center) {
        let s;
        let layer = this.layer;
        let pos = shape.position();
        let dist = Math.max(pos.distanceTo(center), 1);
        let _dist = layer.resolution().length();

        if (revert) {
            let diff = (dist - _dist);
            let f = diff / _dist;
            s = 1 - f;

        } else {
            s = dist / _dist;
        }

        if (isNaN(s)) {
            s = 1;
        }

        s *= this.settings.sizing_scale;
        let x = this.settings.sizing_x * s;
        let y = this.settings.sizing_y * s;
        let z = this.settings.sizing_z * s;

        return new Vector3(x, y, z);
    }
}

class desphere extends SizingModePlugin {
    static name = 'desphere';

    apply(shape) {
        let layer = this.layer;
        layer.getSizingModePlugin('sphere').apply(shape, true);
    }

}

export {sphere, desphere};
