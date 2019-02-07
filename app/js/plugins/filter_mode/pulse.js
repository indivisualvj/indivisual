HC.plugins.filter_mode.pulse = _class(false, HC.FilterModePlugin, {
    apply: function (shape) {
        var layer = this.layer;

        var speed = layer.getShapeSpeed(shape);
        var color = shape.color;
        var v = 50 + 25 * (HC.Osci.sinInOut(speed.prc));

        v *= this.settings.filter_volume;
        v = Math.abs(cutoff(v, 100));
        color.s = v;
        color.l = v;
    }
});
