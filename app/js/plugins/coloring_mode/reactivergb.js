HC.plugins.coloring_mode.reactivergb = _class(false, HC.ColoringModePlugin, {
    name: 'reactive RGB',
    apply: function (shape, reactive, radial) {
        var layer = this.layer;

        var color = shape.color;
        color = hslToRgb(color);
        var matrix = layer.getPatternPlugin('matrix');
        var gridPosition = matrix.gridPosition(shape);

        var v = 0.75 * this.settings.coloring_volume;
        var m1 = 2;
        if (reactive !== false) {
            var sync = this.settings.coloring_sync;
            var fbdv = shape.shapeVolume();

            if (!sync && gridPosition.y > 1) {
                var i = gridPosition.x - 1;
                if (layer.shapes[i]) {
                    var c2 = layer.shapes[i];
                    fbdv = c2.shapeVolume() * 0.6;
                }
            }

            v = (!sync ? fbdv : audio.volume);
            m1 = (audioman.isActive() ? 8 : 2);
        }

        var prc;
        if (radial) {
            var ps = new THREE.Vector2(shape.x(), shape.y());
            var dv = layer.resolution('half');
            ps.sub(dv);

            prc = (reactive ? 6 : 3) * (layer.resolution('half').length() - ps.length()) / layer.resolution('half').length();

        } else {
            prc = m1 * (1 + gridPosition.y) / matrix.rowCount(layer); // original KEEP!
        }

        prc *= RAD * 180 * v * this.settings.coloring_volume;

        color.r = (Math.sin(prc) / 2 + 0.5) * 255;
        color.g = (Math.sin(prc + 60 * RAD) / 2 + 0.5) * 255;
        color.b = (Math.sin(prc + 120 * RAD) / 2 + 0.5) * 255;

        color = rgbToHsl(color);
        copyHsl(color, shape.color);
    }
});

HC.plugins.coloring_mode.reactivergbc = _class(false, HC.ColoringModePlugin, {
    name: 'reactive RGB center',
    apply: function (shape) {
        var layer = this.layer;
        layer.getColoringModePlugin('reactivergb').apply(shape, true, true);
    }
});

HC.plugins.coloring_mode.floatrgb = _class(false, HC.ColoringModePlugin, {
    name: 'float RGB',
    apply: function (shape) {
        var layer = this.layer;
        layer.getColoringModePlugin('reactivergb').apply(shape, false, false);
    }
});

HC.plugins.coloring_mode.floatrgbc = _class(false, HC.ColoringModePlugin, {
    name: 'float RGB center',
    apply: function (shape) {
        var layer = this.layer;
        layer.getColoringModePlugin('reactivergb').apply(shape, false, true);
    }
});
