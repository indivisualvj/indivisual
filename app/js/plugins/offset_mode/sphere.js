HC.plugins.offset_mode.sphere = _class(false, HC.OffsetModePlugin, {
    name: 'sphere',

    apply(shape, revert) {
        var layer = this.layer;

        var m = 1;
        var pos = shape.position();
        var dist = Math.max(pos.distanceTo(layer.patternCenterVector(true)), 1);
        var _dist = layer.resolution().length();

        if (revert) {
            var diff = (dist - _dist);
            var f = diff / _dist;
            m = 1 - f;

        } else {
            m = dist / _dist;
        }

        if (isNaN(m)) {
            m = 1;
        }

        m *= -layer.shapeSize(.5);

        var x = this.settings.offset_x * m;
        var y = this.settings.offset_y * m;
        var z = this.settings.offset_z * m;

        shape.offset(x, y, z);
    }
});

HC.plugins.offset_mode.desphere = _class(false, HC.OffsetModePlugin, {
    name: 'desphere',
    apply(shape) {
        var layer = this.layer;
        layer.getOffsetModePlugin('sphere').apply(shape, true);
    }
});