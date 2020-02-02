HC.plugins.pattern_mover = HC.plugins.pattern_mover || {};
{
    HC.PatternMoverPlugin = class Plugin extends HC.AnimationPlugin {

        setControlSets(controlSets) {
            super.setControlSets(controlSets);
            // make all such plugins make use of corresponding controlset only
            this.settings = controlSets.pattern.properties;
        }

    }
}
