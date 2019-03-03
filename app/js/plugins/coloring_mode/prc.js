{
    HC.plugins.coloring_mode.growprc = class Plugin extends HC.ColoringModePlugin {
        static name = 'grow by progress';

        apply(shape, grow, step, times) {
            let layer = this.layer;
            let color = shape.color;
            let speed = layer.getShapeSpeed(shape);

            if (step && times) {
                let prc = round(1 / times, 1);
                if (speed.prc == 0) {
                    if (grow === false) {
                        color.h = 1;

                    } else {
                        color.h = prc;
                    }

                }
                if (round(speed.prc, 1) % prc == 0) {

                    if (grow === false) {
                        color.h = 1 - Math.min(1, speed.prc);

                    } else {
                        color.h = Math.min(1, speed.prc + prc);
                    }

                } else {
                    color.h = speed.prc;
                }

            } else {
                if (grow === false) {
                    color.h = 1 - speed.prc;

                } else {
                    color.h = speed.prc;
                }
            }

            color.h = color.h * 360 * this.settings.coloring_volume;
            color.s = 100;
            color.l = 50;
        }
    }
}
{
    HC.plugins.coloring_mode.shrinkprc = class Plugin extends HC.ColoringModePlugin {
        static name = 'shrink by progress';

        apply(shape) {
            let layer = this.layer;
            layer.getColoringModePlugin('growprc').apply(shape, false, false, false);
        }
    }
}
{
    HC.plugins.coloring_mode.grow2step = class Plugin extends HC.ColoringModePlugin {
        static name = 'grow 2 steps by progress';

        apply(shape) {
            let layer = this.layer;
            layer.getColoringModePlugin('growprc').apply(shape, true, true, 2);
        }
    }
}
{
    HC.plugins.coloring_mode.shrink2step = class Plugin extends HC.ColoringModePlugin {
        static name = 'shrink 2 steps by progress';

        apply(shape) {
            let layer = this.layer;
            layer.getColoringModePlugin('growprc').apply(shape, false, true, 2);
        }
    }
}
{
    HC.plugins.coloring_mode.grow4step = class Plugin extends HC.ColoringModePlugin {
        static name = 'grow 4 steps by progress';

        apply(shape) {
            let layer = this.layer;
            layer.getColoringModePlugin('growprc').apply(shape, true, true, 4);
        }
    }
}
{
    HC.plugins.coloring_mode.shrink4step = class Plugin extends HC.ColoringModePlugin {
        static name = 'shrink 4 steps by progress';

        apply(shape) {
            let layer = this.layer;
            layer.getColoringModePlugin('growprc').apply(shape, false, true, 4);
        }
    }
}