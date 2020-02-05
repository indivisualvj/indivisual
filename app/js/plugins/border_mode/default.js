
{
    /**
     *
     * @type {HC.Display.border_mode.visible}
     */
    HC.Display.border_mode.visible = class Plugin extends HC.Display.BorderModePlugin  {

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
}

{
    /**
     *
     * @type {HC.Display.border_mode.parent}
     */
    HC.Display.border_mode.parent = class Plugin extends HC.Display.BorderModePlugin  {

        static index = 1;

        apply (ctx, points, pc, speed, prc) {
            HC.Display.border_mode.visible.apply(ctx, points, pc, speed, prc);
        }
    }
}

{
    /**
     *
     * @type {HC.Display.border_mode.randomall}
     */
    HC.Display.border_mode.randomall = class Plugin extends HC.Display.BorderModePlugin  {

        static index = 999;
        static name = 'random all';

        current = 0;
        modes = {};
        modeCount = 0;
        modeKeys = [];
        currentMode = 0;

        init() {
            for (let k in HC.Display.border_mode) {
                if (k !== this.constructor.name) {
                    this.modeKeys[this.modeCount++] = k;
                    this.modes[k] = HC.Display.border_mode[k];
                }
            }
        }

        apply (ctx, points, pc, speed, prc) {
            if (speed.starting()) {
                this.currentMode = randomInt(0, this.modeCount-1);
            }
            HC.Display.border_mode[this.modeKeys[this.currentMode]].apply(ctx, points, pc, speed, prc);
        }
    }
}

{
    /**
     *
     * @type {HC.Display.border_mode.randomline}
     */
    HC.Display.border_mode.randomline = class Plugin extends HC.Display.BorderModePlugin  {

        static name = 'random line';

        apply (ctx, points, pc, speed, prc) {
            ctx.beginPath();
            if (((speed === false && this.displayManager.audioAnalyser.peak) || prc === 0) || !ctx.canvas._side) {
                ctx.canvas._side = randomInt(1, pc - 1);
            }
            let s = (ctx.canvas._side - 1) * 2;
            let x1 = points[s];
            let y1 = points[s + 1];
            let x2 = points[s + 2];
            let y2 = points[s + 3];
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

{
    /**
     *
     * @type {HC.Display.border_mode.linecw}
     */
    HC.Display.border_mode.linecw = class linecw extends HC.Display.BorderModePlugin  {

        static name = 'grow clockwise';

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
}

{
    /**
     *
     * @type {HC.Display.border_mode.lineacw}
     */
    HC.Display.border_mode.lineacw = class lineacw extends HC.Display.BorderModePlugin {

        static name = 'grow anti-clockwise';

        apply (ctx, points, pc, speed, prc) {
            points = this.points_reverse(points);
            HC.Display.border_mode.linecw.apply(ctx, points, pc, speed, prc);
        }
    }
}

{
    /**
     *
     * @type {HC.Display.border_mode.jumpcw}
     */
    HC.Display.border_mode.jumpcw = class jumpcw extends HC.Display.BorderModePlugin {

        static name = 'jump clockwise';

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
}

{
    /**
     *
     * @type {HC.Display.border_mode.jumpacw}
     */
    HC.Display.border_mode.jumpacw = class jumpacw extends HC.Display.BorderModePlugin {

        static name = 'jump anti-clockwise';

        apply (ctx, points, pc, speed, prc) {
            points = this.points_reverse(points);
            HC.Display.border_mode.jumpcw.apply(ctx, points, pc, speed, prc);
        }
    }
}

{
    /**
     *
     * @type {HC.Display.border_mode.growcw}
     */
    HC.Display.border_mode.growcw = class growcw extends HC.Display.BorderModePlugin {

        static name = 'line clockwise';

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
}

{
    /**
     *
     * @type {HC.Display.border_mode.growacw}
     */
    HC.Display.border_mode.growacw = class growacw extends HC.Display.BorderModePlugin {

        static name = 'line anti-clockwise';

        apply (ctx, points, pc, speed, prc) {
            points = this.points_reverse(points);
            HC.Display.border_mode.growcw.apply(ctx, points, pc, speed, prc);
        }
    }
}
