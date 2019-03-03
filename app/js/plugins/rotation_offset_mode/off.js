{
    HC.plugins.rotation_offset_mode.off = class Plugin extends HC.RotationOffsetModePlugin {
        static index = 1;
        static name = 'off';

        apply(shape) {
            let layer = this.layer;
            let x = 90 * this.settings.rotation_offsetx;
            let y = 90 * this.settings.rotation_offsety;
            let z = 90 * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}