{
    HC.plugins.coloring_mode.off = class Plugin extends HC.ColoringModePlugin {
        static name = 'off';
        static index = 1;

        apply(shape) {
            let c = shape.color;
            c.h = 0;
            c.s = 100;
            c.l = 50;
        }
    }
}