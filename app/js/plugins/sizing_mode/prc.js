HC.plugins.sizing_mode.prc = _class(false, HC.SizingModePlugin, {
    name: 'prcgrow',
    apply: function (shape, grow, step, times) {
        var layer = this.layer;

        var s = this.calculate(shape, grow, step, times);
        s *= this.settings.sizing_scale;

        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);

    },
    calculate: function (shape, grow, step, times) {
        var layer = this.layer;
        var speed = layer.getShapeSpeed(shape);

        if (step && times) {
            var prc = round(1 / times, 1);

            if (speed.prc == 0) {
                if (grow === false) {
                    return 1;

                } else {
                    return prc;
                }

            }
            if (round(speed.prc, 1) % prc == 0) {

                if (grow === false) {
                    return 1 - Math.min(1, speed.prc);

                } else {
                    return Math.min(1, speed.prc + prc);
                }

            } else if (this.settings.sizing_mode_sync == false) {
                return shape.size();

            } else {
                return shape.size() / this.settings.sizing_scale;
            }

        } else {
            if (grow === false) {
                return 1 - speed.prc;

            } else {
                return speed.prc;
            }
        }
    }
});

HC.plugins.sizing_mode.prcshrink = _class(false, HC.SizingModePlugin, {
    apply: function (shape) {
        var layer = this.layer;
        layer.getSizingModePlugin('prc').apply(shape, false);
    }
});

HC.plugins.sizing_mode.grow2step = _class(false, HC.SizingModePlugin, {
    apply: function (shape) {
        var layer = this.layer;
        layer.getSizingModePlugin('prc').apply(shape, true, true, 2);
    }
});

HC.plugins.sizing_mode.grow4step = _class(false, HC.SizingModePlugin, {
    apply: function (shape) {
        var layer = this.layer;
        layer.getSizingModePlugin('prc').apply(shape, true, true, 4);
    }
});

HC.plugins.sizing_mode.shrink2step = _class(false, HC.SizingModePlugin, {
    apply: function (shape) {
        var layer = this.layer;
        layer.getSizingModePlugin('prc').apply(shape, false, true, 2);
    }
});

HC.plugins.sizing_mode.shrink4step = _class(false, HC.SizingModePlugin, {
    apply: function (shape) {
        var layer = this.layer;
        layer.getSizingModePlugin('prc').apply(shape, false, true, 4);
    }
});
