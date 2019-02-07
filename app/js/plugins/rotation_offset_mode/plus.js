HC.plugins.rotation_offset_mode.plus90 = _class(false, HC.RotationOffsetModePlugin, {
    name: 'plus90',

    apply: function (shape) {
        var layer = this.layer;

        var a = 90;

        var x = a * this.settings.rotation_offsetx;
        var y = a * this.settings.rotation_offsety;
        var z = a * this.settings.rotation_offsetz;

        shape.rotationOffset(x, y, z);
    }
});
