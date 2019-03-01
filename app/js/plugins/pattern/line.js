HC.plugins.pattern.lineh = _class(false, HC.PatternPlugin, {
    name: 'lineh',

    apply(shape) {
        var layer = this.layer;
        var pos = this.calculate(shape);
        layer.positionIn3dSpace(shape, pos.x, pos.y, pos.z);
    },

    calculate(shape) {
        var layer = this.layer;
        var step = layer.resolution().x / layer.shapeCount();
        var cx = layer.resolution('half').x;
        var pos = shape.index * step;
        var dist = cx - pos;
        var padding = this.settings.pattern_padding * this.settings.pattern_paddingx;

        pos = -dist * padding + step * padding / 2;

        var x = pos;
        var y = 0;
        var z = 0;

        return {x: x, y: y, z: z};
    }
});

HC.plugins.pattern.linev = _class(false, HC.PatternPlugin, {
    name: 'linev',

    apply(shape) {
        var layer = this.layer;
        var pos = this.calculate(shape);
        layer.positionIn3dSpace(shape, pos.x, pos.y, pos.z);
    },

    calculate(shape) {
        var layer = this.layer;
        var step = layer.resolution().y / layer.shapeCount();
        var cy = layer.resolution('half').y;
        var pos = shape.index * step;
        var dist = cy - pos;
        var padding = this.settings.pattern_padding * this.settings.pattern_paddingy;

        pos = -dist * padding + step * padding / 2;

        var x = 0;
        var y = pos;
        var z = 0;

        return {x: x, y: y, z: z};
    }
});
