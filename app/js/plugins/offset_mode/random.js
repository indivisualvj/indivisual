HC.plugins.offset_mode.random = _class(false, HC.OffsetModePlugin, {
    name: 'random',
    injections: {
        value: false
    },

    apply(shape) {
        var layer = this.layer;

        var params = this.params(shape);

        if (!params.value) {
            params.value = (layer.shapeSize(1) / randomFloat(0.1, 1, 2, true));
        }

        var m = params.value;
        var x = this.settings.offset_x * m;
        var y = this.settings.offset_y * m;
        var z = this.settings.offset_z * m;

        shape.offset(x, y, z);

    }
});