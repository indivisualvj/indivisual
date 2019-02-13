HC.plugins.coloring_mode = HC.plugins.coloring_mode || {};

HC.ColoringModePlugin = _class(false, HC.AnimationPlugin, {

    before: function (shape) {
        var locked = this.shapeColoringModeLocked(shape);
        if (locked) {
            return false;
        }
    },

    after: function (shape) {
        var c = shape.color;
        c.h += this.settings.coloring_hue;
        c.s *= this.settings.coloring_sat;
        c.l *= this.settings.coloring_lum * 2;

        if (audioman.isActive() && this.settings.coloring_audio) {
            var v = audio.volume;
            if (!this.settings.coloring_sync) {
                v = shape.shapeVolume();
            }

            c.h += v * 360;
        }

        c.h = c.h % 360;
    },

    shapeColoringModeLocked: function (shape, enabled) {
        if (shape) {
            var plugin = this.layer.getColoringModePlugin();
            var params = plugin.params(shape);
            if (enabled !== undefined) {
                params.__locked = enabled;
            }
            return params.__locked;
        }

        return false;
    }
});