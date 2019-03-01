HC.plugins.offset_mode.grow = _class(false, HC.OffsetModePlugin, {

    apply(shape) {
        var layer = this.layer;

        var m = (shape.index + 1) / -2;
        var x = this.settings.offset_x * m;
        var y = this.settings.offset_y * m;
        var z = this.settings.offset_z * m;

        shape.offset(x, y, z);
    }
});

HC.plugins.offset_mode.shrink = _class(false, HC.OffsetModePlugin, {

    apply(shape) {
        var layer = this.layer;

        var m = (layer.shapeCount() - shape.index) / 2;
        var x = this.settings.offset_x * m;
        var y = this.settings.offset_y * m;
        var z = this.settings.offset_z * m;

        shape.offset(x, y, z);
    }
});
