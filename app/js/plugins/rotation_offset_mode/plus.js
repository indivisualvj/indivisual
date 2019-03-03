{
    HC.plugins.rotation_offset_mode.plus90 = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'plus90';

        apply(shape) {
            let layer = this.layer;

            let a = 90;

            let x = a * this.settings.rotation_offsetx;
            let y = a * this.settings.rotation_offsety;
            let z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}