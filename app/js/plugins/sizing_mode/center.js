HC.plugins.sizing_mode.center = _class(false, HC.SizingModePlugin, {
    apply(shape, revert) {
        var layer = this.layer;
        var s = 1;
        var x = shape.x();
        var y = shape.y();
        var mx = layer.patternCenterX();
        var my = layer.patternCenterY();
        var dx = mx - x;
        var dy = my - y;
        var dt = Math.sqrt(mx * mx + my * my);
        var dr = Math.sqrt(dx * dx + dy * dy);

        if (revert !== true) {
            s = 0.2 + dr / dt;
        } else {
            s = 1 - dr / dt;
        }

        if (isNaN(s)) {
            s = 1;
        }

        s *= this.settings.sizing_scale;
        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
});

HC.plugins.sizing_mode.decenter = _class(false, HC.SizingModePlugin, {
    apply(shape) {
        var layer = this.layer;
        layer.getSizingModePlugin('center').apply(shape, true);
    }
});

