/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OscillatePlugin} from "../OscillatePlugin";

    class audio extends OscillatePlugin {
        static name = 'audio';
        static index = 10;

        apply(key) {
            return this.activate(key, Math.min(1, 2.5 * this.audioAnalyser.volume));
        }
    }

export {audio};
