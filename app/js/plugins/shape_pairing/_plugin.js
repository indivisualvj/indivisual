HC.plugins.shape_pairing = HC.plugins.shape_pairing || {};
{
    HC.ShapePairingPlugin = class Plugin extends HC.AnimationPlugin {

        setControlSets(controlSets) {
            super.setControlSets(controlSets);
            // make all such plugins make use of corresponding controlset only
            this.settings = controlSets.shape.properties;
        }

    }
}
