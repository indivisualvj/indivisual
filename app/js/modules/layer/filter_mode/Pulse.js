/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {FilterModePlugin} from "../FilterModePlugin";
import {Oscillators} from "../../../shared/Oscillators";

class pulse extends FilterModePlugin {
    apply(shape) {
        let layer = this.layer;

        let speed = layer.shapeSpeed(shape);
        let color = shape.color;
        let v = 50 + 25 * (Oscillators.sinInOut(speed.prc));

        v *= this.settings.filter_volume;
        v = Math.abs(cutoff(v, 100));
        color.s = v;
        color.l = v;
    }
}

export {pulse}
