/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class PatternMoverPlugin extends HC.AnimationPlugin {

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.pattern.properties;
    }

}

export {PatternMoverPlugin};