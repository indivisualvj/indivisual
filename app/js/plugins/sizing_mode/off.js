HC.plugins.sizing_mode.off = _class(false, HC.SizingModePlugin, {
    index: 1,
    name: 'off',

    apply: function (shape) {
        var layer = this.layer;
        var s = 1;
        s *= this.settings.sizing_scale;
        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
});