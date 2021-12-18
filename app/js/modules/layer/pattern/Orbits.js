/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternPlugin} from "../PatternPlugin";

class orbits extends PatternPlugin {
    static name = 'orbits';
    injections = {};

    apply(shape) {
        let layer = this.layer;

        let params = this.params(shape);

        let firstRun = false;
        if (!params.groundSpeed) {
            firstRun = true;
            params.groundSpeed = randomFloat(0.2, 1, 2);
            params.startAngle = params.groundAngle = randomInt(0, 360, false);

            if (this.settings.pattern_sync) {
                let _lcsc = 0;
                params.shellIndex = 0;
                for (let si = 1; si <= 4; si++) {
                    let csc = 2 * si * si;
                    if (shape.index < csc && shape.index >= _lcsc) {
                        params.shellIndex = si;
                        break;
                    }
                    _lcsc = csc;
                }
            } else {
                params.shellIndex = randomFloat(1, 4, 2);
            }
        }

        let shell = params.shellIndex;
        let p = this.settings.pattern_padding;
        let px = this.settings.pattern_paddingx;
        let py = this.settings.pattern_paddingy;
        let pz = this.settings.pattern_paddingz;

        let shellDiamenter = layer.resolution('half').length() / 4;
        let radius = shellDiamenter * shell * p;
        let maxX = radius * px;
        let maxY = radius * py;
        let maxZ = radius * pz;

        let speed = params.groundSpeed * 0.05 * shape.size();
        if (this.settings.pattern_limit && !firstRun) {
            let position = shape.position();

            let distance = position.distanceTo(this.patternCenterVector());
            speed = shape.size() / distance * 25;
        }

        params.groundAngle += speed * this.animation.diff;
        if (params.groundAngle - params.startAngle > 360) {
            params.groundAngle -= 360;
        }

        let radiants = params.groundAngle * RAD;

        let x = Math.sin(radiants);
        let y = Math.cos(radiants);
        let z = Math.cos(radiants + params.startAngle * RAD);

        x = x * maxX;
        y = y * maxY;
        z = z * maxZ;

        this.positionIn3dSpace(shape, x, y, z);
    }
}

export {orbits};
