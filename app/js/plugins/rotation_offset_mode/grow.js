HC.plugins.rotation_offset_mode.grow = _class(false, HC.RotationOffsetModePlugin, {
    name: 'grow',

    apply: function (shape) {
        var layer = this.layer;
        var part = 360 / layer.shapeCount();
        var a = part * (shape.index + 1);

        var x = a * this.settings.rotation_offsetx;
        var y = a * this.settings.rotation_offsety;
        var z = a * this.settings.rotation_offsetz;

        shape.rotationOffset(x, y, z);
    }
});

HC.plugins.rotation_offset_mode.growingfour45 = _class(false, HC.RotationOffsetModePlugin, {
    name: 'growingfour45',

    apply: function (shape) {
        var layer = this.layer;

        var a = 45;
        var mod = shape.index % 4;
        a *= (mod + 1);

        var x = a * this.settings.rotation_offsetx;
        var y = a * this.settings.rotation_offsety;
        var z = a * this.settings.rotation_offsetz;

        shape.rotationOffset(x, y, z);
    }
});
