{
    HC.plugins.rotation_offset_mode.grow = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'grow';

        apply(shape) {
            var layer = this.layer;
            var part = 360 / layer.shapeCount();
            var a = part * (shape.index + 1);

            var x = a * this.settings.rotation_offsetx;
            var y = a * this.settings.rotation_offsety;
            var z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}
{
    HC.plugins.rotation_offset_mode.growingfour45 = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'growingfour45';

        apply(shape) {
            var a = 45;
            var mod = shape.index % 4;
            a *= (mod + 1);

            var x = a * this.settings.rotation_offsetx;
            var y = a * this.settings.rotation_offsety;
            var z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}