HC.plugins.coloring_mode.off = _class(false, HC.ColoringModePlugin, {
    name: 'off',
    index: 1,
    apply(shape) {
        var c = shape.color;
        c.h = 0;
        c.s = 100;
        c.l = 50;
    }
});
