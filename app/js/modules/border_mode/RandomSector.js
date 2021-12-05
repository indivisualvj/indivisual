/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class RandomSector extends BorderModePlugin
{
    static name = 'random sector';
    static index = 43;

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

export {RandomSector}