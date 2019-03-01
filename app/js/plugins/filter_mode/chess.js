HC.plugins.filter_mode.chess2 = _class(
    function () {
        this.invert = false;
    },
    HC.FilterModePlugin, {
        name: 'chess ²',
        apply(shape, plugin) {
            var layer = this.layer;

            if (this.isFirstShape(shape)) {
                if (audioman.isActive() && audio.peak) {
                    this.invert = !this.invert;
                }
            }

            layer.getFilterModePlugin(plugin || 'pulse').apply(shape);

            var color = shape.color;

            if (this.invert) {
                if (shape.index % 2 == 1) {
                    var pi = shape.index - 1;
                    if (pi >= 0 && pi < layer.shapes.length) {
                        var src = layer.shapes[pi].color;
                        this.chess(src, color);
                    }
                }

            } else {
                if (shape.index % 2 == 0) {
                    var ni = shape.index + 1;
                    if (ni >= 0 && ni < layer.shapes.length) {
                        var src = layer.shapes[ni].color;
                        this.chess(src, color);
                    }
                }
            }
        },

        chess(src, target) {
            target.h = src.h + 180;
            if (target.h > 360) {
                target.h -= 360;
            }

            target.s = src.s + 50;
            target.l = src.l + 40;
            if (target.s > 100) {
                target.s -= 100;
            }
            if (target.l > 80) {
                target.l -= 80;
            }
        }
    }
);

HC.plugins.filter_mode.chess2flash = _class(false, HC.FilterModePlugin, {
    name: 'chess ² flash',
    apply(shape) {
        var layer = this.layer;
        layer.getFilterModePlugin('chess2').apply(shape, 'flash');
    }
});

HC.plugins.filter_mode.chess2strobe = _class(false, HC.FilterModePlugin, {
    name: 'chess ² strobe',
    apply(shape) {
        var layer = this.layer;
        layer.getFilterModePlugin('chess2').apply(shape, 'strobe');
    }
});