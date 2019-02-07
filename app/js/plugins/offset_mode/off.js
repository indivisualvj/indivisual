HC.plugins.offset_mode.off = _class(false, HC.OffsetModePlugin, {
    name: 'off',
    index: 1,
    apply: function (shape) {
        var layer = this.layer;
        var m = layer.shapeSize(.5);
        var x = this.settings.offset_x * m;
        var y = this.settings.offset_y * m;
        var z = this.settings.offset_z * m;
        shape.offset(x, y, z);
    }
});
