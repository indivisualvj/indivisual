/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class SizingFlipPlugin extends HC.AnimationPlugin {

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.sizing.properties;
    }

}

export {SizingFlipPlugin}
