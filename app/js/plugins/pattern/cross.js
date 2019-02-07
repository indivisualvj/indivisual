HC.plugins.pattern.cross = _class(false, HC.PatternPlugin, {
    name: 'cross',

    apply: function (shape) {
        var layer = this.layer;


        var index = shape.index;
        var mod = index % 4;
        var x = 0;
        var y = 0;
        var z = 0;

        if (index != 0) {
            var rad = Math.floor(index / 4) * layer.shapeSize(1) * this.settings.pattern_padding;
            var deg = 90 * mod;

            x = Math.sin(deg * RAD) * rad;
            y = Math.cos(deg * RAD) * rad;
        }

        layer.positionIn3dSpace(shape, x, y, z);
    }
});