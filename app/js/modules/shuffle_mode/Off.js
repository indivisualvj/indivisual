/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShuffleModePlugin} from "../../shared/ShuffleModePlugin";

class Off extends ShuffleModePlugin {
    static index = 1;

    apply() {
        return false;
    }
}

export {Off}