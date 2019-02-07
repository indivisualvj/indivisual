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
        var step = layer.diameterVector.x / layer.shapeCount() * offset;
        var pos = (shape.index) * step - layer.diameterVector.x / 2 * offset - step / 2;

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
        var step = layer.diameterVector.y / layer.shapeCount() * offset;
        var pos = (shape.index) * step - layer.diameterVector.y / 2 * offset - step / 2;

        var x = this.settings.pattern_paddingx;
        var y = pos;
        var z = 0;

        return {x: x, y: y, z: z};
    }
});
