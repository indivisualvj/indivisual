/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OscillatePlugin} from "../OscillatePlugin";

class timestamp extends OscillatePlugin {
        static name = 'timestamp';
        static index = 10;

        apply(key) {
            return this.activate(key, (this.animation.now - this.beatKeeper.beatStartTime) / (60000 / this.config.ControlSettings.tempo));
        }
    }

export {timestamp};
