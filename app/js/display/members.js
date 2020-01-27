/**
 *
 * @type {{parent: HC.Display.borderModes.parent, randomall: HC.Display.borderModes.randomall, visible: HC.Display.borderModes.visible, jumpcw: HC.Display.borderModes.jumpcw, randomline: HC.Display.borderModes.randomline, jumpacw: HC.Display.borderModes.jumpacw, lineacw: HC.Display.borderModes.lineacw, growcw: HC.Display.borderModes.growcw, growacw: HC.Display.borderModes.growacw, linecw: HC.Display.borderModes.linecw}}
 */
HC.Display.borderModes = {

    'visible': function (ctx, points, pc, speed, prc) {
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        for (var i = 2; i < points.length; i += 2) {
            var x = points[i];
            var y = points[i + 1];

            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    },

    'parent': function (ctx, points, pc, speed, prc) {
        HC.Display.borderModes.visible(ctx, points, pc, speed, prc);
    },

    'randomall': function (ctx, points, pc, speed, prc) {
        HC.Display.borderModes.visible(ctx, points, pc, speed, prc);
    },

    'randomline': function (ctx, points, pc, speed, prc) {
        ctx.beginPath();
        if (((speed === false && audio.peak) || prc === 0) || !ctx.canvas._side) { // todo eliminate audio call
            ctx.canvas._side = randomInt(1, pc - 1);
        }
        var s = (ctx.canvas._side - 1) * 2;
        var x1 = points[s];
        var y1 = points[s + 1];
        var x2 = points[s + 2];
        var y2 = points[s + 3];
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    },

    'linecw': function (ctx, points, pc, speed, prc) {
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        var step = 1 / pc;
        for (var i = 2; i < points.length; i += 2) {
            var thrs = step * i / 2;

            if (prc > thrs) {
                var x = points[i];
                var y = points[i + 1];

                ctx.lineTo(x, y);

            } else {
                break;
            }
        }
        ctx.stroke();
        ctx.closePath();
    },

    'lineacw': function (ctx, points, pc, speed, prc) {
        points = points_reverse(points);
        HC.Display.borderModes.linecw(ctx, points, pc, speed, prc);
    },

    'jumpcw': function (ctx, points, pc, speed, prc) {
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        var step = 1 / (pc);

        for (var i = 2; i < points.length; i += 2) {
            var thrs = step * (i - 2) / 2;

            if (prc > thrs) {
                var diff = prc - thrs;
                var x = points[i];
                var y = points[i + 1];
                var lx = points[i - 2];
                var ly = points[i - 1];
                var dx = x - lx;
                var dy = y - ly;

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
    },

    'jumpacw': function (ctx, points, pc, speed, prc) {
        points = points_reverse(points);
        HC.Display.borderModes.jumpcw(ctx, points, pc, speed, prc);
    },

    'growcw': function (ctx, points, pc, speed, prc) {
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        var step = 1 / (pc - 1);
        for (var i = 2; i < points.length; i += 2) {
            var thrs = step * (i - 2) / 2;
            if (prc > thrs) {
                var diff = prc - thrs;
                var x = points[i];
                var y = points[i + 1];
                var lx = points[i - 2];
                var ly = points[i - 1];
                var dx = x - lx;
                var dy = y - ly;

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
    },

    'growacw': function (ctx, points, pc, speed, prc) {
        points = points_reverse(points);
        HC.Display.borderModes.growcw(ctx, points, pc, speed, prc);
    }
};
