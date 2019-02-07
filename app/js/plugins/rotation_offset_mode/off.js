HC.plugins.rotation_offset_mode.off = _class(false, HC.RotationOffsetModePlugin, {
    index: 1,
    name: 'off',

    apply: function (shape) {
        var layer = this.layer;
        var x = 90 * this.settings.rotation_offsetx;
        var y = 90 * this.settings.rotation_offsety;
        var z = 90 * this.settings.rotation_offsetz;

        shape.rotationOffset(x, y, z);
    }
});