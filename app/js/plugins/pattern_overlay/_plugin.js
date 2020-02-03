HC.plugins.pattern_overlay = HC.plugins.pattern_overlay || {};
{
    HC.plugins.pattern_overlay.off = class Plugin extends HC.PatternPlugin {
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
}
