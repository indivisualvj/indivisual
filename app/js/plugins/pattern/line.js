HC.plugins.pattern.lineh = _class(false, HC.PatternPlugin, {
    name: 'lineh',

    apply: function (shape) {
        var layer = this.layer;
        var pos = this.calculate(shape);
        layer.positionIn3dSpace(shape, pos.x, pos.y, pos.z);
    },

    calculate: function (shape) {
        var layer = this.layer;
        var offset = this.settings.pattern_padding * this.settings.pattern_paddingx;
        var step = layer.resolution().x / layer.shapeCount() * offset;
        var pos = (shape.index) * step - layer.resolution().x / 2 * offset - step / 2;

        var x = pos;
        var y = this.settings.pattern_paddingy;
        var z = 0;

        return {x: x, y: y, z: z};
    }
});

HC.plugins.pattern.linev = _class(false, HC.PatternPlugin, {
    name: 'linev',

    apply: function (shape) {
        var layer = this.layer;
        var pos = this.calculate(shape);
        layer.positionIn3dSpace(shape, pos.x, pos.y, pos.z);
    },

    calculate: function (shape) {
        var layer = this.layer;
        var offset = this.settings.pattern_padding * this.settings.pattern_paddingy;
        var step = layer.resolution().y / layer.shapeCount() * offset;
        var pos = (shape.index) * step - layer.resolution().y / 2 * offset - step / 2;

        var x = this.settings.pattern_paddingx;
        var y = pos;
        var z = 0;

        return {x: x, y: y, z: z};
    }
});
