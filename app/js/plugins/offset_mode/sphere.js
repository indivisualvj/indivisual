{
    HC.plugins.offset_mode.sphere = class Plugin extends HC.OffsetModePlugin {
        static name = 'sphere';

        apply(shape, revert) {
            let layer = this.layer;

            let m = 1;
            let pos = shape.position();
            let dist = Math.max(pos.distanceTo(layer.patternCenterVector(true)), 1);
            let _dist = layer.resolution().length();

            if (revert) {
                let diff = (dist - _dist);
                let f = diff / _dist;
                m = 1 - f;

            } else {
                m = dist / _dist;
            }

            if (isNaN(m)) {
                m = 1;
            }

            m *= -layer.shapeSize(.5);

            let x = this.settings.offset_x * m;
            let y = this.settings.offset_y * m;
            let z = this.settings.offset_z * m;

            shape.offset(x, y, z);
        }
    }
}
{
    HC.plugins.offset_mode.desphere = class Plugin extends HC.OffsetModePlugin {
        static name = 'desphere';

        apply(shape) {
            let layer = this.layer;
            layer.getOffsetModePlugin('sphere').apply(shape, true);
        }
    }
}