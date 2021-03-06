{
    HC.plugins.shape_rhythm.nochange = class Plugin extends HC.ShapeRhythmPlugin {
        static index = 1;
        static name = 'no change';

        apply(shape) {
            let layer = this.layer;
            this.params(shape).speed = layer.getCurrentSpeed();
        }
    }
}
{
    HC.plugins.shape_rhythm.double = class Plugin extends HC.ShapeRhythmPlugin {
        static index = 2;
        static name = 'double';

        apply(shape) {
            this.params(shape).speed = beatkeeper.getSpeed('double');
        }
    }
}
{
    HC.plugins.shape_rhythm.full = class Plugin extends HC.ShapeRhythmPlugin {
        static index = 3;
        static name = 'full';

        apply(shape) {
            this.params(shape).speed = beatkeeper.getSpeed('full');
        }
    }
}
{
    HC.plugins.shape_rhythm.half = class Plugin extends HC.ShapeRhythmPlugin {
        static index = 4;
        static name = 'half';

        apply(shape) {
            this.params(shape).speed = beatkeeper.getSpeed('half');
        }
    }
}
{
    HC.plugins.shape_rhythm.quarter = class Plugin extends HC.ShapeRhythmPlugin {
        static index = 5;
        static name = 'quarter';

        apply(shape) {
            this.params(shape).speed = beatkeeper.getSpeed('quarter');
        }
    }
}