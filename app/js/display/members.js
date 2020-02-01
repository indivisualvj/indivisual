/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
HC.Display.border_modes = {};
{
    /**
     * 
     * @type {HC.Display.BorderModePlugin}
     */
    HC.Display.BorderModePlugin = class BorderModePlugin {

        /**
         * @type {HC.DisplayManager}
         */
        displayManager;

        /**
         *
         * @param {HC.DisplayManager} displayManager
         */
        constructor(displayManager) {
            this.displayManager = displayManager;
        }

        /**
         *
         */
        init() {

        }

        /**
         * 
         * @param array
         * @returns {any[]}
         */
        points_reverse(array) {
            let length = array.length;
            let nu = new Array(length);

            for (let i = 0; i < length; i += 2) {
                nu[i] = array[length - 2 - i];
                nu[i + 1] = array[length - 2 - i + 1];
            }
            return nu;
        }
    }
}

{
    /**
     * 
     * @type {HC.Display.border_modes.visible}
     */
    HC.Display.border_modes.visible = class visible extends HC.Display.BorderModePlugin  {
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
     * @type {HC.Display.border_modes.parent}
     */
    HC.Display.border_modes.parent = class parent extends HC.Display.BorderModePlugin  {
        apply (ctx, points, pc, speed, prc) {
            HC.Display.border_modes.visible.apply(ctx, points, pc, speed, prc);
        }
    }
}

{
    /**
     * 
     * @type {HC.Display.border_modes.randomall}
     */
    HC.Display.border_modes.randomall = class randomall extends HC.Display.BorderModePlugin  {

        current = 0;
        modes = {};
        modeCount = 0;
        modeKeys = [];
        currentMode = 0;

        init() {
            for (let k in HC.Display.border_modes) {
                if (k !== this.constructor.name) {
                    this.modeKeys[this.modeCount++] = k;
                    this.modes[k] = HC.Display.border_modes[k];
                }
            }
        }

        apply (ctx, points, pc, speed, prc) {
            if (speed.starting()) {
                this.currentMode = randomInt(0, this.modeCount-1);
            }
            HC.Display.border_modes[this.modeKeys[this.currentMode]].apply(ctx, points, pc, speed, prc);
        }
    }
}

{
    /**
     * 
     * @type {HC.Display.border_modes.randomline}
     */
    HC.Display.border_modes.randomline = class randomline extends HC.Display.BorderModePlugin  {
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
     * @type {HC.Display.border_modes.linecw}
     */
    HC.Display.border_modes.linecw = class linecw extends HC.Display.BorderModePlugin  {
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
     * @type {HC.Display.border_modes.lineacw}
     */
    HC.Display.border_modes.lineacw = class lineacw extends HC.Display.BorderModePlugin {
        apply (ctx, points, pc, speed, prc) {
            points = this.points_reverse(points);
            HC.Display.border_modes.linecw.apply(ctx, points, pc, speed, prc);
        }
    }
}

{
    /**
     * 
     * @type {HC.Display.border_modes.jumpcw}
     */
    HC.Display.border_modes.jumpcw = class jumpcw extends HC.Display.BorderModePlugin {
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
     * @type {HC.Display.border_modes.jumpacw}
     */
    HC.Display.border_modes.jumpacw = class jumpacw extends HC.Display.BorderModePlugin {
        apply (ctx, points, pc, speed, prc) {
            points = this.points_reverse(points);
            HC.Display.border_modes.jumpcw.apply(ctx, points, pc, speed, prc);
        }
    }
}

{
    /**
     * 
     * @type {HC.Display.border_modes.growcw}
     */
    HC.Display.border_modes.growcw = class growcw extends HC.Display.BorderModePlugin {
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
     * @type {HC.Display.border_modes.growacw}
     */
    HC.Display.border_modes.growacw = class growacw extends HC.Display.BorderModePlugin {
        apply (ctx, points, pc, speed, prc) {
            points = this.points_reverse(points);
            HC.Display.border_modes.growcw.apply(ctx, points, pc, speed, prc);
        }
    }
}
