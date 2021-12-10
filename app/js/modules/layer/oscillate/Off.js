/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OscillatePlugin} from "../OscillatePlugin";

class off extends OscillatePlugin {
        static name = 'off';
        static index = 1;
        // apply is not defined here to avoid plugin execution aka save CPU (haha)
    }

export {off};
