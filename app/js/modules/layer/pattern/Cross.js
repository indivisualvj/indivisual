/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternPlugin} from "../PatternPlugin";

class cross extends PatternPlugin {
        static name = 'cross';

        apply(shape) {
            let layer = this.layer;


            let index = shape.index;
            let mod = index % 4;
            let x = 0;
            let y = 0;
            let z = 0;

            if (index !== 0) {
                let rad = Math.floor(index / 4) * layer.shapeSize(1) * this.settings.pattern_padding;
                let deg = 90 * mod;

                x = Math.sin(deg * RAD) * rad;
                y = Math.cos(deg * RAD) * rad;
            }

            this.positionIn3dSpace(shape, x, y, z);
        }
    }

export {cross};
