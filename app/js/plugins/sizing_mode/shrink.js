HC.plugins.sizing_mode.shrink = _class(false, HC.SizingModePlugin, {
    name: 'shrink',

    apply: function (shape) {
        var layer = this.layer;
        var s = (layer.shapeCount() + 1) * 0.025 - 0.025 * (shape.index + 1);
        s *= this.settings.sizing_scale;
        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
});

HC.plugins.sizing_mode.shrinkrow = _class(false, HC.SizingModePlugin, {
    name: 'shrinkrow',

    apply: function (shape) {
        var layer = this.layer;
        var matrix = layer.getPatternPlugin('matrix');
        var s = 1 - 1 / matrix.rowCount(layer) * matrix.gridPosition(shape);
        s *= this.settings.sizing_scale;
        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
});
