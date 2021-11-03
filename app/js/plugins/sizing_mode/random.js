{
    HC.plugins.sizing_mode.random = class Plugin extends HC.SizingModePlugin {
        static name = 'random';
        injections = {size: false};

        apply(shape, onpeak) {
            let params = this.params(shape);
            let s = 1;
            if (!params.size || (onpeak && this.audioAnalyser.peak && randomInt(0, 3) === 0)) {
                s = randomFloat(0.1, 2.0, 2, false);
                params.size = s;

            } else {
                s = params.size;
            }

            s *= this.settings.sizing_scale;
            let x = this.settings.sizing_x * s;
            let y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);
        }
    }
}
{
    HC.plugins.sizing_mode.randompeak = class Plugin extends HC.SizingModePlugin {
        static name = 'random on peak';

        apply(shape) {
            let layer = this.layer;
            layer.getSizingModePlugin('random').apply(shape, true);
        }
    }
}
