/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OscillatePlugin} from "../OscillatePlugin";

class appearlinout extends OscillatePlugin {
        static name = 'appear & linout';

        apply(key) {
            let layer = this.layer;
            let speed = layer.currentSpeed();
            return this.activate(key, 1 - speed.prc);
        }
    }


    class appearexpout extends OscillatePlugin {
        static name = 'appear & expout';

        apply(key) {
            let layer = this.layer;
            let speed = layer.currentSpeed();
            return this.activate(key, Math.pow(1 - speed.prc, 2));
        }
    }


    class appearlogout extends OscillatePlugin {
        static name = 'appear & logout';

        apply(key) {
            let layer = this.layer;
            let speed = layer.currentSpeed();
            return this.activate(key, Math.sqrt(1 - speed.prc));
        }
    }

export {appearexpout, appearlogout, appearlinout};
