{
    HC.plugins.offset_mode.grow = class Plugin extends HC.OffsetModePlugin {

        apply(shape) {
            let m = (shape.index + 1) / -2;
            let x = this.settings.offset_x * m;
            let y = this.settings.offset_y * m;
            let z = this.settings.offset_z * m;

            shape.offset(x, y, z);
        }
    }
}
{
    HC.plugins.offset_mode.shrink = class Plugin extends HC.OffsetModePlugin {

        apply(shape) {
            let layer = this.layer;

            let m = (layer.shapeCount() - shape.index) / 2;
            let x = this.settings.offset_x * m;
            let y = this.settings.offset_y * m;
            let z = this.settings.offset_z * m;

            shape.offset(x, y, z);
        }
    }
}