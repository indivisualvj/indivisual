/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class JumpClockwise extends BorderModePlugin {

    static name = 'jump clockwise';
    static index = 30;

    apply (ctx, points, pc, speed, prc) {
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        let step = 1 / (pc);

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
                    dx *= diff;
                    dy *= diff;

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

class JumpAntiClockwise extends BorderModePlugin {

    static name = 'jump anti-clockwise';
    static index = 31;

    apply (ctx, points, pc, speed, prc) {
        points = this.points_reverse(points);
        BorderModePlugin.plugins.jumpclockwise.apply(ctx, points, pc, speed, prc);
    }
}

export {JumpAntiClockwise, JumpClockwise};


