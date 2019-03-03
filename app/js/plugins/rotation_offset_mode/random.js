{
    HC.plugins.rotation_offset_mode.random = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'random';
        injections = {
            degrees: false
        };

        apply(shape) {

            let params = this.params(shape);
            if (!params.degrees) {
                params.degrees = randomInt(0, 360);
            }
            let a = params.degrees;

            let x = a * this.settings.rotation_offsetx;
            let y = a * this.settings.rotation_offsety;
            let z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}