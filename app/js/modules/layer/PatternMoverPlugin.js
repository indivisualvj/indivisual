/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../AnimationPlugin";

class PatternMoverPlugin extends AnimationPlugin
{

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.pattern.properties;
    }

}

export {PatternMoverPlugin};
