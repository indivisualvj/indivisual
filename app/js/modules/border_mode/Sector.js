/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {BorderModePlugin} from "../BorderModePlugin";

class SectorGrowClockwise extends BorderModePlugin  {

    static name = 'sector grow clockwise';
    static index = 40;

    apply (ctx, points, pc, speed, prc) {
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        let step = 1 / pc;
        for (let i = 2; i < points.length; i += 2) {
            let thrs = step * i / 2;

            if (prc > thrs) {
                let x = points[i];
                let y = points[i + 1];

                ctx.lineTo(x, y);

            } else {
                break;
            }
        }
        ctx.stroke();
        ctx.closePath();
    }
}

class SectorGrowAntiClockwise extends BorderModePlugin {

    static name = 'sector grow anti-clockwise';
    static index = 41;

    apply (ctx, points, pc, speed, prc) {
        points = this.points_reverse(points);
        BorderModePlugin.plugins.sectorgrowclockwise.apply(ctx, points, pc, speed, prc);
    }
}

export {SectorGrowAntiClockwise, SectorGrowClockwise};
