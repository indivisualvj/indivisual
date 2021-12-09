/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class RotationOffsetModePlugin extends HC.AnimationPlugin {

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.rotation.properties;
    }

}

export {RotationOffsetModePlugin};
