{
    HC.plugins.rotation_offset_mode.random = class Plugin extends HC.RotationOffsetModePlugin {
        static name = 'random';
        injections = {
            degrees: false
        };

        apply(shape) {

            var params = this.params(shape);
            if (!params.degrees) {
                params.degrees = randomInt(0, 360);
            }
            var a = params.degrees;

            var x = a * this.settings.rotation_offsetx;
            var y = a * this.settings.rotation_offsety;
            var z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}