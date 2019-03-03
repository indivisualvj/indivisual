{
    HC.plugins.rotation_offset_mode.grow = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'grow';

        apply(shape) {
            let layer = this.layer;
            let part = 360 / layer.shapeCount();
            let a = part * (shape.index + 1);

            let x = a * this.settings.rotation_offsetx;
            let y = a * this.settings.rotation_offsety;
            let z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}
{
    HC.plugins.rotation_offset_mode.growingfour45 = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'growingfour45';

        apply(shape) {
            let a = 45;
            let mod = shape.index % 4;
            a *= (mod + 1);

            let x = a * this.settings.rotation_offsetx;
            let y = a * this.settings.rotation_offsety;
            let z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}