HC.plugins.sizing_mode.random = _class(false, HC.SizingModePlugin, {
    name: 'random',
    injections: {size: false},

    apply: function (shape, onpeak) {
        var layer = this.layer;

        var params = this.params(shape);
        var s = 1;
        if (!params.size || (onpeak && audio.peak && randomInt(0, 3) === 0)) {
            s = randomFloat(0.1, 2.0, 2, false);
            params.size = s;

        } else {
            s = params.size;
        }

        s *= this.settings.sizing_scale;
        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
});

HC.plugins.sizing_mode.randompeak = _class(false, HC.SizingModePlugin, {
    name: 'random on peak',

    apply: function (shape) {
        var layer = this.layer;
        layer.getSizingModePlugin('random').apply(shape, true);
    }
});
