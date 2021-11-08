{
    HC.plugins.sizing_mode.prc = class Plugin extends HC.SizingModePlugin {
        static name = 'prcgrow';

        apply(shape, grow, step, times) {
            let s = this.calculate(shape, grow, step, times);
            s *= this.settings.sizing_scale;

            let x = this.settings.sizing_x * s;
            let y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);

        }

        calculate(shape, grow, step, times) {
            let layer = this.layer;
            let speed = layer.getShapeSpeed(shape);

            if (step && times) {
                let prc = round(1 / times, 1);

                if (speed.prc === 0) {
                    if (grow === false) {
                        return 1;

                    } else {
                        return prc;
                    }

                }
                if (round(speed.prc, 1) % prc === 0) {

                    if (grow === false) {
                        return 1 - Math.min(1, speed.prc);

                    } else {
                        return Math.min(1, speed.prc + prc);
                    }

                } else if (this.settings.sizing_mode_sync == false) {
                    return shape.size();

                } else {
                    return shape.size() / this.settings.sizing_scale;
                }

            } else {
                if (grow === false) {
                    return 1 - speed.prc;

                } else {
                    return speed.prc;
                }
            }
        }
    }
}
{
    HC.plugins.sizing_mode.prcshrink = class Plugin extends HC.SizingModePlugin {
        apply(shape) {
            let layer = this.layer;
            layer.getSizingModePlugin('prc').apply(shape, false);
        }
    }
}
{
    HC.plugins.sizing_mode.grow2step = class Plugin extends HC.SizingModePlugin {
        apply(shape) {
            let layer = this.layer;
            layer.getSizingModePlugin('prc').apply(shape, true, true, 2);
        }
    }
}
{
    HC.plugins.sizing_mode.grow4step = class Plugin extends HC.SizingModePlugin {
        apply(shape) {
            let layer = this.layer;
            layer.getSizingModePlugin('prc').apply(shape, true, true, 4);
        }
    }
}
{
    HC.plugins.sizing_mode.shrink2step = class Plugin extends HC.SizingModePlugin {
        apply(shape) {
            let layer = this.layer;
            layer.getSizingModePlugin('prc').apply(shape, false, true, 2);
        }
    }
}
{
    HC.plugins.sizing_mode.shrink4step = class Plugin extends HC.SizingModePlugin {
        apply(shape) {
            let layer = this.layer;
            layer.getSizingModePlugin('prc').apply(shape, false, true, 4);
        }
    }
}