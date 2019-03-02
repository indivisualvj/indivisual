{
    HC.plugins.sizing_mode.shrink = class Plugin extends HC.SizingModePlugin {
        static name = 'shrink';

        apply(shape) {
            let layer = this.layer;
            let s = (layer.shapeCount() + 1) * 0.025 - 0.025 * (shape.index + 1);
            s *= this.settings.sizing_scale;
            let x = this.settings.sizing_x * s;
            let y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);
        }
    }
}
{
    HC.plugins.sizing_mode.shrinkrow = class Plugin extends HC.SizingModePlugin {
        static name = 'shrinkrow';

        apply(shape) {
            let layer = this.layer;
            let matrix = layer.getPatternPlugin('matrix');
            let s = 1 - 1 / matrix.rowCount(layer) * matrix.gridPosition(shape);
            s *= this.settings.sizing_scale;
            let x = this.settings.sizing_x * s;
            let y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);
        }
    }
}