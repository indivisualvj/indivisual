/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeRhythmPlugin} from "../ShapeRhythmPlugin";

class nochange extends ShapeRhythmPlugin {
    static index = 1;
    static name = 'no change';

    apply(shape) {
        let layer = this.layer;
        this.params(shape).speed = layer.currentSpeed();
    }
}


class double extends ShapeRhythmPlugin {
    static index = 2;
    static name = 'double';

    apply(shape) {
        this.params(shape).speed = this.beatKeeper.getSpeed('double');
    }
}


class full extends ShapeRhythmPlugin {
    static index = 3;
    static name = 'full';

    apply(shape) {
        this.params(shape).speed = this.beatKeeper.getSpeed('full');
    }
}


class half extends ShapeRhythmPlugin {
    static index = 4;
    static name = 'half';

    apply(shape) {
        this.params(shape).speed = this.beatKeeper.getSpeed('half');
    }
}


class quarter extends ShapeRhythmPlugin {
    static index = 5;
    static name = 'quarter';

    apply(shape) {
        this.params(shape).speed = this.beatKeeper.getSpeed('quarter');
    }
}

export {double, full, half, nochange, quarter};
