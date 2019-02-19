HC.plugins.sizing_mode.onefiveanddotfive = _class(false, HC.SizingModePlugin, {
    name: '1.5|0.5',

    apply: function (shape) {
        var layer = this.layer;
        var s = (shape.index % 2 == 0) ? 1.50 : 0.50;
        s *= this.settings.sizing_scale;
        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
});

HC.plugins.sizing_mode.twoandone = _class(false, HC.SizingModePlugin, {
    name: '2|1',

    apply: function (shape) {
        var layer = this.layer;
        var s = (shape.index % 2 == 0) ? 2.00 : 1.00;
        s *= this.settings.sizing_scale;
        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
});

HC.plugins.sizing_mode.dotfiveandonefive = _class(false, HC.SizingModePlugin, {
    name: '0.5|1.5',

    apply: function (shape) {
        var layer = this.layer;
        var s = (shape.index % 2 == 0) ? 0.50 : 1.50;

        s *= this.settings.sizing_scale;
        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
});

HC.plugins.sizing_mode.oneandtwo = _class(false, HC.SizingModePlugin, {
    name: '1|2',

    apply: function (shape) {
        var s = (shape.index % 2 == 0) ? 1.00 : 2.00;
        s *= this.settings.sizing_scale;
        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
});

HC.plugins.sizing_mode.oneandfive = _class(false, HC.SizingModePlugin, {
    name: '1|5',

    apply: function (shape) {
        var s = (shape.index % 2 == 0) ? 1.00 : 5.00;
        s *= this.settings.sizing_scale;
        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
});

HC.plugins.sizing_mode.fiveandone = _class(false, HC.SizingModePlugin, {
    name: '5|1',

    apply: function (shape) {
        var s = (shape.index % 2 == 0) ? 5.00 : 1.00;
        s *= this.settings.sizing_scale;
        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
});
