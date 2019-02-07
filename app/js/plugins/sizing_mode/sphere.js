HC.plugins.sizing_mode.sphere = _class(false, HC.SizingModePlugin, {
    name: 'sphere',
    apply: function (shape, revert) {
        var layer = this.layer;


        var size = this.calculate(shape, revert, layer.patternCenterVector(true));

        shape.scale(size.x, size.y, size.z);
    },

    calculate: function (shape, revert, center) {
        var s = 1;
        var layer = this.layer;
        var pos = shape.position();
        var dist = Math.max(pos.distanceTo(center), 1);
        var _dist = layer.diameterVector.length();

        if (revert) {
            var diff = (dist - _dist);
            var f = diff / _dist;
            s = 1 - f;

        } else {
            s = dist / _dist;
        }

        if (isNaN(s)) {
            s = 1;
        }

        s *= this.settings.sizing_scale;
        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        return new THREE.Vector3(x, y, z);
    }
});

HC.plugins.sizing_mode.desphere = _class(false, HC.SizingModePlugin, {
    name: 'desphere',
    apply: function (shape) {
        var layer = this.layer;
        layer.getSizingModePlugin('sphere').apply(shape, true);
    }
});
