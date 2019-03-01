HC.plugins.coloring_mode.growprc = _class(false, HC.ColoringModePlugin, {
    name: 'grow by progress',

    apply(shape, grow, step, times) {
        var layer = this.layer;
        var color = shape.color;
        var speed = layer.getShapeSpeed(shape);

        if (step && times) {
            var prc = round(1 / times, 1);
            if (speed.prc == 0) {
                if (grow === false) {
                    color.h = 1;

                } else {
                    color.h = prc;
                }

            }
            if (round(speed.prc, 1) % prc == 0) {

                if (grow === false) {
                    color.h = 1 - Math.min(1, speed.prc);

                } else {
                    color.h = Math.min(1, speed.prc + prc);
                }

            } else {
                color.h = speed.prc;
            }

        } else {
            if (grow === false) {
                color.h = 1 - speed.prc;

            } else {
                color.h = speed.prc;
            }
        }

        color.h = color.h * 360 * this.settings.coloring_volume;
        color.s = 100;
        color.l = 50;
    }
});

HC.plugins.coloring_mode.shrinkprc = _class(false, HC.ColoringModePlugin, {
    name: 'shrink by progress',
    apply(shape) {
        var layer = this.layer;
        layer.getColoringModePlugin('growprc').apply(shape, false, false, false);
    }
});

HC.plugins.coloring_mode.grow2step = _class(false, HC.ColoringModePlugin, {
    name: 'grow 2 steps by progress',
    apply(shape) {
        var layer = this.layer;
        layer.getColoringModePlugin('growprc').apply(shape, true, true, 2);
    }
});

HC.plugins.coloring_mode.shrink2step = _class(false, HC.ColoringModePlugin, {
    name: 'shrink 2 steps by progress',
    apply(shape) {
        var layer = this.layer;
        layer.getColoringModePlugin('growprc').apply(shape, false, true, 2);
    }
});

HC.plugins.coloring_mode.grow4step = _class(false, HC.ColoringModePlugin, {
    name: 'grow 4 steps by progress',
    apply(shape) {
        var layer = this.layer;
        layer.getColoringModePlugin('growprc').apply(shape, true, true, 4);
    }
});

HC.plugins.coloring_mode.shrink4step = _class(false, HC.ColoringModePlugin, {
    name: 'shrink 4 steps by progress',
    apply(shape) {
        var layer = this.layer;
        layer.getColoringModePlugin('growprc').apply(shape, false, true, 4);
    }
});