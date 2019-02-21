HC.plugins.coloring_mode.motley = _class(false, HC.ColoringModePlugin, {
    name: 'motley',
    index: 2,
    apply: function (shape, min, max) {

        var color = shape.color;
        var mi2 = 60;
        var ma2 = 100;

        if (!min) {
            min = 30;
            max = 60;

        } else {
            mi2 = 60;
            ma2 = 100;
        }

        var da = color.da * animation.diff / 360 * this.settings.coloring_volume;
        var db = color.db;
        var dc = color.dc;

        // Hue
        if (color.h + da < 360 && color.h + da > 0) {
            color.h += da;

        } else {
            if (color.h + da < 0) {
                color.h = 360;

            } else {
                color.h = 0;
            }
        }

        // Saturation
        if (color.s < mi2) {
            color.s = mi2;

        } else if (color.s > ma2) {
            color.s = ma2;
        }

        if (color.s + db <= ma2 && color.s + db >= mi2) {
            color.s += db * animation.diff / 80;

        } else {
            color.db *= -1;
            color.s = Math.min(color.s, ma2);
        }

        // Luminance
        if (color.l < min) {
            color.l = min;

        } else if (color.l > max) {
            color.l = max;
        }

        if (color.l + dc <= max && color.l + dc >= min) {
            color.l += dc * animation.diff / 80;

        } else {
            color.dc *= -1;
            color.l = Math.min(color.l, max);
        }
    }
});

HC.plugins.coloring_mode.one = _class(false, HC.ColoringModePlugin, {
    name: 'one',
    index: 1,
    apply: function (shape) {

        if (this.isFirstShape(shape)) {
            this.color = shape.color;

            this.layer.getColoringModePlugin('motley').apply(shape, 40, 60);

        } else if (this.color) {
            shape.color.h = this.color.h;
            shape.color.s = this.color.s;
            shape.color.l = this.color.l;
        }
    },

    after: function (shape) {
        var l = shape.color.l;
        HC.ColoringModePlugin.prototype.after.call(this, shape);
        if (!this.isFirstShape(shape)) {
            shape.color.l = l;
        }
    }
});