/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {RotationOffsetModePlugin} from "../RotationOffsetModePlugin";

class wave extends RotationOffsetModePlugin {
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

        let a = 10 * Math.cos(RAD * va);

        let x = a * this.settings.rotation_offsetx;
        let y = a * this.settings.rotation_offsety;
        let z = a * this.settings.rotation_offsetz;

        shape.rotationOffset(x, y, z);
    }
}

export {wave};
