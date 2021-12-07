/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeRhythmPlugin} from "../ShapeRhythmPlugin";

class random extends ShapeRhythmPlugin {
    apply(shape) {
        let params = this.params(shape);

        if (!params.speed) {
            let keys = Object.keys(this.beatKeeper.speeds);
            let i = randomInt(2, keys.length - 2);
            let speed = keys[i];
            params.speed = this.beatKeeper.getSpeed(speed);
        }
    }
}

export {random};
