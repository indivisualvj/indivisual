HC.plugins.sizing_mode.grow = _class(false, HC.SizingModePlugin, {
    name: 'grow',

    apply(shape) {
        var layer = this.layer;
        var s = 0.025 * (shape.index + 1);
        s *= this.settings.sizing_scale;
        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
});

HC.plugins.sizing_mode.growrow = _class(false, HC.SizingModePlugin, {
    name: 'growrow',

    apply(shape) {
        var layer = this.layer;
        var matrix = layer.getPatternPlugin('matrix');
        var s = 1 / matrix.rowCount(layer) * matrix.gridPosition(shape).y;
        s *= this.settings.sizing_scale;
        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
});
