/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ColoringModePlugin} from "../ColoringModePlugin";

class growprc extends ColoringModePlugin {
    static name = 'grow by progress';

    apply(shape, grow, step, times) {
        let layer = this.layer;
        let color = shape.color;
        let speed = layer.shapeSpeed(shape);

        if (step && times) {
            let prc = round(1 / times, 1);
            if (speed.prc === 0) {
                if (grow === false) {
                    color.h = 1;

                } else {
                    color.h = prc;
                }

            }
            if (round(speed.prc, 1) % prc === 0) {

                if (grow === false) {
                    color.h = 1 - Math.min(1, speed.prc);

                } else {
                    color.h = Math.min(1, speed.prc + prc);
                }

            } else {
                color.h = speed.prc;
            }

        } else {
            if (grow === false) {
                color.h = 1 - speed.prc;

            } else {
                color.h = speed.prc;
            }
        }

        color.h = color.h * 360 * this.settings.coloring_volume;
        color.s = 100;
        color.l = 50;
    }
}


class shrinkprc extends ColoringModePlugin {
    static name = 'shrink by progress';

    apply(shape) {
        let layer = this.layer;
        layer.getColoringModePlugin('growprc').apply(shape, false, false, false);
    }
}


class grow2step extends ColoringModePlugin {
    static name = 'grow 2 steps by progress';

    apply(shape) {
        let layer = this.layer;
        layer.getColoringModePlugin('growprc').apply(shape, true, true, 2);
    }
}


class shrink2step extends ColoringModePlugin {
    static name = 'shrink 2 steps by progress';

    apply(shape) {
        let layer = this.layer;
        layer.getColoringModePlugin('growprc').apply(shape, false, true, 2);
    }
}


class grow4step extends ColoringModePlugin {
    static name = 'grow 4 steps by progress';

    apply(shape) {
        let layer = this.layer;
        layer.getColoringModePlugin('growprc').apply(shape, true, true, 4);
    }
}


class shrink4step extends ColoringModePlugin {
    static name = 'shrink 4 steps by progress';

    apply(shape) {
        let layer = this.layer;
        layer.getColoringModePlugin('growprc').apply(shape, false, true, 4);
    }
}

export {shrink4step, shrink2step, grow4step, grow2step, growprc, shrinkprc};
