/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../AnimationPlugin";

class ShapeDelayPlugin extends AnimationPlugin {

    injections = {
        delay: 0
    };

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.shape.properties;
    }

    before(shape) {
        let params = this.params(shape);
        params.delay = 0;

        // no special speed for pattern rotation
        if (this.isFirstShape(shape)) {
            return false;
        }
    }

    after(shape) {
        let layer = this.layer;
        let params = this.params(shape);
        let rp = layer.shapeSpeed(shape);

        params.delay -= params.delay * rp.speed.prc;
        params.delay = clamp(params.delay, 0, rp.duration); // bondage to 0 or duration ...
        rp.duration -= params.delay; // ... so that duration can't be less than 0

    }

    update(shape, diff) {
        this.params(shape).delay -= diff;
    }

    finished(shape) {
        let params = this.params(shape);
        return !(params.delay > 0);
    }

    isFirstShape(shape) {
        return shape.index === -1;
    }
}

export {ShapeDelayPlugin};
