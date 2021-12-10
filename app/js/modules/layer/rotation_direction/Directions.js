/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {RotationDirectionPlugin} from "../RotationDirectionPlugin";

class random extends RotationDirectionPlugin {
    static index = 1;

    // place at the start for random
    apply(shape) {
        let layer = this.layer;
        let params = this.params(shape);

        let keys = Object.keys(this.config.AnimationValues.rotation_direction);
        params.mode = keys[randomInt(1, keys.length - 1)];

        let plugin = layer.getRotationDirectionPlugin(params.mode);
        plugin.apply(shape);

        params.dir = plugin.params(shape).dir;
    }
}


class left extends RotationDirectionPlugin {
    static index = 2;

    apply(shape) {
        this.params(shape).dir = -1;
    }
}


class right extends RotationDirectionPlugin {
    static index = 3;

    apply(shape) {
        this.params(shape).dir = 1;
    }
}


class leftorright extends RotationDirectionPlugin {
    static name = 'left | right';
    shared = {
        dir: 0
    };

    apply(shape) {
        if (this.isFirstShape(shape)) {
            this.shared.dir = randomBool() ? -1 : 1;
        }

        this.params(shape).dir = this.shared.dir;
    }
}


class leftandright extends RotationDirectionPlugin {
    static name = 'left & right';

    apply(shape) {
        this.params(shape).dir = (shape.index % 2 === 0) ? -1 : 1;
    }
}


export {leftandright, leftorright, left, right, random};
