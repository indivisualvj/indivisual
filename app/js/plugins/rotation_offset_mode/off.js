{
    HC.plugins.rotation_offset_mode.off = class Plugin extends HC.RotationOffsetModePlugin {
        static index = 1;
        static name = 'off';

        apply(shape) {
            var layer = this.layer;
            var x = 90 * this.settings.rotation_offsetx;
            var y = 90 * this.settings.rotation_offsety;
            var z = 90 * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}