{
    HC.plugins.shape_rhythm.doublequad = class Plugin extends HC.ShapeRhythmPlugin {
        static name = 'double/quad';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            if (shape.index % 2 == 0) {
                params.speed = beatKeeper.speeds.double;

            } else {
                params.speed = beatKeeper.speeds.quad;
            }
        }
    }
}
{
    HC.plugins.shape_rhythm.quaddouble = class Plugin extends HC.ShapeRhythmPlugin {
        static name = 'quad/double';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            if (shape.index % 2 == 0) {
                params.speed = beatKeeper.speeds.quad;

            } else {
                params.speed = beatKeeper.speeds.double;
            }
        }
    }
}
{
    HC.plugins.shape_rhythm.doublefull = class Plugin extends HC.ShapeRhythmPlugin {
        static name = 'double/full';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            if (shape.index % 2 == 0) {
                params.speed = beatKeeper.speeds.double;

            } else {
                params.speed = beatKeeper.speeds.full;
            }
        }
    }
}
{
    HC.plugins.shape_rhythm.fulldouble = class Plugin extends HC.ShapeRhythmPlugin {
        static name = 'full/double';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            if (shape.index % 2 == 0) {
                params.speed = beatKeeper.speeds.full;

            } else {
                params.speed = beatKeeper.speeds.double;
            }
        }
    }
}
{
    HC.plugins.shape_rhythm.fullhalf = class Plugin extends HC.ShapeRhythmPlugin {
        static name = 'full/half';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            if (shape.index % 2 == 0) {
                params.speed = beatKeeper.speeds.full;

            } else {
                params.speed = beatKeeper.speeds.half;
            }
        }
    }
}
{
    HC.plugins.shape_rhythm.halffull = class Plugin extends HC.ShapeRhythmPlugin {
        static name = 'half/full';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            if (shape.index % 2 == 1) {
                params.speed = beatKeeper.speeds.full;

            } else {
                params.speed = beatKeeper.speeds.half;
            }
        }
    }
}
{
    HC.plugins.shape_rhythm.halfquarter = class Plugin extends HC.ShapeRhythmPlugin {
        static name = 'half/quarter';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            if (shape.index % 2 == 0) {
                params.speed = beatKeeper.speeds.half;

            } else {
                params.speed = beatKeeper.speeds.quarter;
            }
        }
    }
}
{
    HC.plugins.shape_rhythm.quarterhalf = class Plugin extends HC.ShapeRhythmPlugin {
        static name = 'quarter/half';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            if (shape.index % 2 == 0) {
                params.speed = beatKeeper.speeds.quarter;

            } else {
                params.speed = beatKeeper.speeds.half;
            }
        }
    }
}
{
    HC.plugins.shape_rhythm.fullhalfquarter = class Plugin extends HC.ShapeRhythmPlugin {
        static name = 'full/half/quarter';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            let mod = shape.index % 3;
            switch (mod) {
                case 0:
                    params.speed = beatKeeper.speeds.full;
                    break;

                case 1:
                    params.speed = beatKeeper.speeds.half;
                    break;

                case 2:
                    params.speed = beatKeeper.speeds.quarter;
                    break;
            }
        }
    }
}
{
    HC.plugins.shape_rhythm.fullhalfquartereight = class Plugin extends HC.ShapeRhythmPlugin {
        static name = 'full/half/quarter/eight';

        apply(shape, reverse) {
            let params = this.params(shape);
            let mod = shape.index % 4;
            if (reverse) {
                mod = 4 - mod;
            }
            switch (mod) {
                case 0:
                    params.speed = beatKeeper.speeds.full;
                    break;

                case 1:
                    params.speed = beatKeeper.speeds.half;
                    break;

                case 2:
                    params.speed = beatKeeper.speeds.quarter;
                    break;

                case 3:
                    params.speed = beatKeeper.speeds.eight;
            }
        }
    }
}
{
    HC.plugins.shape_rhythm.eightquarterhalffull = class Plugin extends HC.ShapeRhythmPlugin {
        static name = 'eight/quarter/half/full';

        apply(shape) {
            let layer = this.layer;
            let plugin = layer.getShapeRhythmPlugin('fullhalfquartereight');
            plugin.apply(shape, true);
            this.params(shape).speed = plugin.params(shape).speed;
        }
    }
}
