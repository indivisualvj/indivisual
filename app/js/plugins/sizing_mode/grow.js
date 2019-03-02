{
    HC.plugins.sizing_mode.grow = class Plugin extends HC.SizingModePlugin {
        static name = 'grow';

        apply(shape) {
            let s = 0.025 * (shape.index + 1);
            s *= this.settings.sizing_scale;
            let x = this.settings.sizing_x * s;
            let y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);
        }
    }
}
{
    HC.plugins.sizing_mode.growrow = class Plugin extends HC.SizingModePlugin {
        static name = 'growrow';

        apply(shape) {
            let layer = this.layer;
            let matrix = layer.getPatternPlugin('matrix');
            let s = 1 / matrix.rowCount(layer) * matrix.gridPosition(shape).y;
            s *= this.settings.sizing_scale;
            let x = this.settings.sizing_x * s;
            let y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);
        }
    }
}