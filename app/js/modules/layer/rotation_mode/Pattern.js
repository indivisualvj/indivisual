/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {_default} from "./Default";

class one extends _default {
    /**
     * @see RotationModePlugin.injections
     */

    /**
     *
     * @param shape{Shape}
     */
    apply(shape) {
        if (this.isFirstShape(shape)) {
            this.index = randomInt(0, this.layer.shapeCount());
        }
        if (shape.index === this.index) {
            super.apply(shape);
        }
    }
}


class chess extends _default {
    /**
     * @see RotationModePlugin.injections
     */

    /**
     *
     * @param shape{Shape}
     */
    apply(shape) {
        if (this.isFirstShape(shape)) {
            this.switcher = !this.switcher;
        }

        let mod = this.switcher ? 0 : 1;

        if (shape.index % 2 === mod) {
            super.apply(shape);

        }
    }
}

export {one, chess};
