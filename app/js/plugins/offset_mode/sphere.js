{
    HC.plugins.offset_mode.sphere = class Plugin extends HC.OffsetModePlugin {
        static name = 'sphere';

        apply(shape) {
            let layer = this.layer;
            let pos = layer.patternCenterVector(true);

            let a = shape.position().distanceTo(pos);
            let m = a * layer.shapeSize(.01);
            let x = this.settings.offset_x * m;
            let y = this.settings.offset_y * m;
            let z = this.settings.offset_z * m;

            shape.offset(x, y, z);

        }
    }
}