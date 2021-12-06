/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {BorderModePlugin} from "../../shared/BorderModePlugin";

class GrowClockwise extends BorderModePlugin {

    static name = 'grow clockwise';
    static index = 20;

    apply (ctx, points, pc, speed, prc) {
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        let step = 1 / (pc - 1);
        for (let i = 2; i < points.length; i += 2) {
            let thrs = step * (i - 2) / 2;
            if (prc > thrs) {
                let diff = prc - thrs;
                let x = points[i];
                let y = points[i + 1];
                let lx = points[i - 2];
                let ly = points[i - 1];
                let dx = x - lx;
                let dy = y - ly;

                if (diff < step) {
                    dx *= diff / step;
                    dy *= diff / step;

                    x = lx + dx;
                    y = ly + dy;

                }
                ctx.lineTo(x, y);

            } else {
                break;
            }
        }
        ctx.stroke();
        ctx.closePath();
    }
}

class GrowAntiClockwise extends BorderModePlugin
{
    static name = 'grow anti-clockwise';
    static index = 21;

    apply (ctx, points, pc, speed, prc) {
        points = this.points_reverse(points);
        BorderModePlugin.plugins.growclockwise.apply(ctx, points, pc, speed, prc);
    }
}

export {GrowAntiClockwise, GrowClockwise};
