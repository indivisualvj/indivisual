/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {LightingTypePlugin} from "../LightingTypePlugin";

class off extends LightingTypePlugin {
    static index = 1;

    create() {
        return false;
    }
}

export {off};
