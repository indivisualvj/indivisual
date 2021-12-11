/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OffsetModePlugin} from "../OffsetModePlugin";

class xing extends OffsetModePlugin {
    static name = 'xing';
    injections = {
        direction: 0
    };
    direction = 0;

    apply(shape) {
        let layer = this.layer;

        let speed = layer.shapeSpeed(shape);
        let params = this.params(shape);

        let xx = this.settings.offset_x !== 0;
        let xy = this.settings.offset_y !== 0;
        let xz = this.settings.offset_z !== 0;

        let directions = [
            xx ? 1 : 0,
            xx ? -1 : 0,
            xy ? 1 : 0,
            xy ? -1 : 0,
            xz ? 1 : 0,
            xz ? -1 : 0
        ];

        let maxdir = (xx ? 2 : 0) + (xy ? 2 : 0) + (xz ? 2 : 0);

        if (speed.prc <= 0) {
            // next direction
            if (this.isFirstShape(shape)) {
                this.direction++;
                if (this.direction >= maxdir) {
                    this.direction = 0;
                }
            }

            if (!this.settings.offset_sync) {
                params.direction = randomInt(0, maxdir - 1);
            } else {
                params.direction = this.direction;
            }
        }

        let dir = params.direction;
        let progress = speed.prc - .5;
        progress = Math.pow(progress, 2) * 4;
        progress = Math.max(0, 1 - progress);

        let x = 0,
            y = 0,
            z = 0;

        // map direction on possible axes
        let _direction = 0;
        for (let i = 0; i < directions.length; i++) {

            if (directions[i] !== 0) {
                if (_direction === dir) {

                    if (i < 2) {
                        x = progress * directions[i];
                    } else if (i < 4) {
                        y = progress * directions[i];
                    } else {
                        z = progress * directions[i];
                    }

                    break;
                }
                _direction++;
            }
        }

        let m = layer.shapeSize(.5);
        x *= this.settings.offset_x * m;
        y *= this.settings.offset_y * m;
        z *= this.settings.offset_z * m;

        shape.offset(x, y, z);

    }
}

export {xing};
