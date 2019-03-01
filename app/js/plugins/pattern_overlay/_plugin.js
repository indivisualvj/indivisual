HC.plugins.pattern_overlay = HC.plugins.pattern_overlay || {};
{
    HC.plugins.pattern_overlay.off = class Plugin extends HC.PatternPlugin {
        static index = 1;
        static name = 'off';

        apply(shape) {

        }
    }
}
