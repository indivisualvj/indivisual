{
    HC.plugins.sizing_mode.beat = class Plugin extends HC.SizingModePlugin {
        static name = 'beat';

        apply(shape) {
            let s = this.calculate(shape);
            // s *= this.settings.sizing_scale;

            let x = this.settings.sizing_x * s;
            let y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);

        }

        threshold = .05;

        calculate(shape) {
            let layer = this.layer;
            let speed = layer.shapeSpeed(shape);
            let prc   = speed.prc;
            let thrs  = this.threshold * this.settings.sizing_scale;
            let thrsS = 1 - thrs;
            let thrsE = thrs;

            if (prc > thrsE && prc < thrsS) {
                return thrsS;

            } else {
                if (prc >= thrsS) {
                    let t = 1 - prc;
                    return 1 - t;

                } else if (prc <= thrsE) {
                    return 1 - prc;
                }
            }
        }
    }
}