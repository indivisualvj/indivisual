/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {SizingModePlugin} from "../SizingModePlugin";

class wave extends SizingModePlugin {
    static name = 'wave';
    angle = 0;

    apply(shape) {
        let layer = this.layer;
        if (this.isFirstShape(shape)) {
            let dur = this.beatKeeper.getDefaultSpeed().duration;
            let step = 45 / dur;
            this.angle += this.animation.diff * step;

            if (this.angle > 360 || isNaN(this.angle)) {
                this.angle = 0;
            }
        }
        let va = this.angle + 360 / layer.shapeCount() * shape.index;
        va = va > 360 ? va - 360 : va;

        let s = Math.cos(RAD * va);

        s *= this.settings.sizing_scale;
        let x = this.settings.sizing_x * s;
        let y = this.settings.sizing_y * s;
        let z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
}

export {wave}