/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternPlugin} from "../PatternPlugin";

class Off extends PatternPlugin {
    static index = 1;
    static name = 'off';

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.pattern.properties;
    }

    apply(shape) {

    }
}

export {Off};
