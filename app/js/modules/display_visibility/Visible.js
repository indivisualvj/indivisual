/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {DisplayVisibilityPlugin} from "../../shared/DisplayVisibilityPlugin";

class Visible extends DisplayVisibilityPlugin  {

    static index = 1;

    apply (display) {
        display.visible = true;
        display.blitz = false;
        // display.smear = false;
        display.judder = false;
    }
}

export {Visible}