{
    HC.plugins.sizing_mode.onefiveanddotfive = class Plugin extends HC.SizingModePlugin {
        static name = '1.5|0.5';

        apply(shape) {
            let layer = this.layer;
            let s = (shape.index % 2 === 0) ? 1.50 : 0.50;
            s *= this.settings.sizing_scale;
            let x = this.settings.sizing_x * s;
            let y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);
        }
    }
}
{
    HC.plugins.sizing_mode.twoandone = class Plugin extends HC.SizingModePlugin {
        static name = '2|1';

        apply(shape) {
            let layer = this.layer;
            let s = (shape.index % 2 === 0) ? 2.00 : 1.00;
            s *= this.settings.sizing_scale;
            let x = this.settings.sizing_x * s;
            let y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);
        }
    }
}
{
    HC.plugins.sizing_mode.dotfiveandonefive = class Plugin extends HC.SizingModePlugin {
        static name = '0.5|1.5';

        apply(shape) {
            let layer = this.layer;
            let s = (shape.index % 2 === 0) ? 0.50 : 1.50;

            s *= this.settings.sizing_scale;
            let x = this.settings.sizing_x * s;
            let y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);
        }
    }
}
{
    HC.plugins.sizing_mode.oneandtwo = class Plugin extends HC.SizingModePlugin {
        static name = '1|2';

        apply(shape) {
            let s = (shape.index % 2 === 0) ? 1.00 : 2.00;
            s *= this.settings.sizing_scale;
            let x = this.settings.sizing_x * s;
            let y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);
        }
    }
}
{
    HC.plugins.sizing_mode.oneandfive = class Plugin extends HC.SizingModePlugin {
        static name = '1|5';

        apply(shape) {
            let s = (shape.index % 2 === 0) ? 1.00 : 5.00;
            s *= this.settings.sizing_scale;
            let x = this.settings.sizing_x * s;
            let y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);
        }
    }
}
{
    HC.plugins.sizing_mode.fiveandone = class Plugin extends HC.SizingModePlugin {
        static name = '5|1';

        apply(shape) {
            let s = (shape.index % 2 === 0) ? 5.00 : 1.00;
            s *= this.settings.sizing_scale;
            let x = this.settings.sizing_x * s;
            let y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);
        }
    }
}