/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {BorderModePlugin} from "../BorderModePlugin";

class Visible extends BorderModePlugin
{
    static index = 10;

    apply (ctx, points, pc, speed, prc) {
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        for (let i = 2; i < points.length; i += 2) {
            let x = points[i];
            let y = points[i + 1];

            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }
}

export {Visible}