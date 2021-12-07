/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeRhythmPlugin} from "../ShapeRhythmPlugin";

class doublequad extends ShapeRhythmPlugin {
    static name = 'double/quad';

    apply(shape) {
        let layer = this.layer;
        let params = this.params(shape);
        if (shape.index % 2 === 0) {
            params.speed = this.beatKeeper.speeds.double;

        } else {
            params.speed = this.beatKeeper.speeds.quad;
        }
    }
}


class quaddouble extends ShapeRhythmPlugin {
    static name = 'quad/double';

    apply(shape) {
        let layer = this.layer;
        let params = this.params(shape);
        if (shape.index % 2 === 0) {
            params.speed = this.beatKeeper.speeds.quad;

        } else {
            params.speed = this.beatKeeper.speeds.double;
        }
    }
}


class doublefull extends ShapeRhythmPlugin {
    static name = 'double/full';

    apply(shape) {
        let layer = this.layer;
        let params = this.params(shape);
        if (shape.index % 2 === 0) {
            params.speed = this.beatKeeper.speeds.double;

        } else {
            params.speed = this.beatKeeper.speeds.full;
        }
    }
}


class fulldouble extends ShapeRhythmPlugin {
    static name = 'full/double';

    apply(shape) {
        let layer = this.layer;
        let params = this.params(shape);
        if (shape.index % 2 === 0) {
            params.speed = this.beatKeeper.speeds.full;

        } else {
            params.speed = this.beatKeeper.speeds.double;
        }
    }
}


class fullhalf extends ShapeRhythmPlugin {
    static name = 'full/half';

    apply(shape) {
        let layer = this.layer;
        let params = this.params(shape);
        if (shape.index % 2 === 0) {
            params.speed = this.beatKeeper.speeds.full;

        } else {
            params.speed = this.beatKeeper.speeds.half;
        }
    }
}


class halffull extends ShapeRhythmPlugin {
    static name = 'half/full';

    apply(shape) {
        let layer = this.layer;
        let params = this.params(shape);
        if (shape.index % 2 === 1) {
            params.speed = this.beatKeeper.speeds.full;

        } else {
            params.speed = this.beatKeeper.speeds.half;
        }
    }
}


class halfquarter extends ShapeRhythmPlugin {
    static name = 'half/quarter';

    apply(shape) {
        let layer = this.layer;
        let params = this.params(shape);
        if (shape.index % 2 === 0) {
            params.speed = this.beatKeeper.speeds.half;

        } else {
            params.speed = this.beatKeeper.speeds.quarter;
        }
    }
}


class quarterhalf extends ShapeRhythmPlugin {
    static name = 'quarter/half';

    apply(shape) {
        let layer = this.layer;
        let params = this.params(shape);
        if (shape.index % 2 === 0) {
            params.speed = this.beatKeeper.speeds.quarter;

        } else {
            params.speed = this.beatKeeper.speeds.half;
        }
    }
}


class fullhalfquarter extends ShapeRhythmPlugin {
    static name = 'full/half/quarter';

    apply(shape) {
        let layer = this.layer;
        let params = this.params(shape);
        let mod = shape.index % 3;
        switch (mod) {
            case 0:
                params.speed = this.beatKeeper.speeds.full;
                break;

            case 1:
                params.speed = this.beatKeeper.speeds.half;
                break;

            case 2:
                params.speed = this.beatKeeper.speeds.quarter;
                break;
        }
    }
}


class fullhalfquartereight extends ShapeRhythmPlugin {
    static name = 'full/half/quarter/eight';

    apply(shape, reverse) {
        let params = this.params(shape);
        let mod = shape.index % 4;
        if (reverse) {
            mod = 4 - mod;
        }
        switch (mod) {
            case 0:
                params.speed = this.beatKeeper.speeds.full;
                break;

            case 1:
                params.speed = this.beatKeeper.speeds.half;
                break;

            case 2:
                params.speed = this.beatKeeper.speeds.quarter;
                break;

            case 3:
                params.speed = this.beatKeeper.speeds.eight;
        }
    }
}


class eightquarterhalffull extends ShapeRhythmPlugin {
    static name = 'eight/quarter/half/full';

    apply(shape) {
        let layer = this.layer;
        let plugin = layer.getShapeRhythmPlugin('fullhalfquartereight');
        plugin.apply(shape, true);
        this.params(shape).speed = plugin.params(shape).speed;
    }
}

export {
    doublefull,
    eightquarterhalffull,
    fullhalf,
    fullhalfquarter,
    fullhalfquartereight,
    fulldouble,
    quarterhalf,
    quaddouble,
    doublequad,
    halfquarter,
    halffull
};
