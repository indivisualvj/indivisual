/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ColoringModePlugin} from "../ColoringModePlugin";

class motley extends ColoringModePlugin {
    static name = 'motley';
    static index = 20;
    injections = {
        velocity: false
    };

    apply(shape, minL, maxL) {

        let params = this.params(shape);
        if (!params.velocity) {
            let min = 1;
            let max = 3;
            params.velocity = new THREE.Vector3(
                randomFloat(min, max, 2, true),
                randomFloat(min, max, 2, true),
                randomFloat(min, max, 2, true)
            );
        }

        let color = shape.color;

        let minS = 60;
        let maxS = 100;

        minL = minL || 30;
        maxL = maxL || 60;

        // Hue
        color.h += params.velocity.x * this.animation.diffPrc / 2 * this.settings.coloring_volume;
        color.h %= 360;

        // Saturation
        color.s += params.velocity.y * this.animation.diffPrc / 5;
        if (color.s < minS || color.s > maxS) {
            params.velocity.y *= -1;
            color.s = clamp(color.s, minS, maxS);
        }

        // Luminance
        color.l += params.velocity.z * this.animation.diffPrc / 5;
        if (color.l < minL || color.l > maxL) {
            params.velocity.z *= -1;
            color.l = clamp(color.l, minL, maxL);
        }
    }
}


class one extends ColoringModePlugin {
    static name = 'one';
    static index = 10;

    apply(shape) {

        if (this.isFirstShape(shape)) {
            this.color = shape.color;

            this.layer.getColoringModePlugin('motley').apply(shape, 40, 60);

        } else if (this.color) {
            shape.color.h = this.color.h;
            shape.color.s = this.color.s;
            shape.color.l = this.color.l;
        }
    }

    after(shape) {
        let l = shape.color.l;
        super.after(shape);
        if (!this.isFirstShape(shape)) {
            shape.color.l = l;
        }
    }
}

export {one, motley};
