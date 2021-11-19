/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
HC.plugins.sizing_flip = HC.plugins.sizing_flip || {};
{

    HC.SizingFlipPlugin = class Plugin extends HC.AnimationPlugin {

        setControlSets(controlSets) {
            super.setControlSets(controlSets);
            // make all such plugins make use of corresponding controlset only
            this.settings = controlSets.sizing.properties;
        }

    }
}
