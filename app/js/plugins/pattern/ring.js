HC.plugins.pattern.ring = _class(false, HC.PatternPlugin, {
    name: 'ring',

    apply: function (shape, sides) {
        var layer = this.layer;


        if (!sides) {
            sides = layer.shapeCount();
        }

        var px = this.settings.pattern_paddingx;
        var py = this.settings.pattern_paddingy;

        var seg = Math.PI * 2 / sides;
        var hseg = -Math.PI * 0.5;

        var r = (Math.min(layer.halfDiameterVector.x, layer.halfDiameterVector.y - layer.shapeSize(1))) * this.settings.pattern_padding;

        var i = shape.index % sides;

        var cos = Math.cos(hseg + seg * i);
        var sin = Math.sin(hseg + seg * i);

        var x = cos * r * px;
        var y = sin * r * py;
        var z = 0;

        layer.positionIn3dSpace(shape, x, -y, z);
    }
});

HC.plugins.pattern.triangle = _class(false, HC.PatternPlugin, {
    name: 'triangle',

    apply: function (shape) {
        var layer = this.layer;
        layer.getPatternPlugin('ring').apply(shape, 3);
    }
});

HC.plugins.pattern.lightspeed = _class(false, HC.PatternPlugin, {
    name: 'lightspeed',

    apply: function (shape) {
        var layer = this.layer;


        var x, y, z = shape.z();

        if (z == 0 || z > layer.cameraDefaultDistance()) {
            z = randomInt(-100000, -5000, false);

        } else {
            z += animation.diff * 10 * this.settings.pattern_paddingz;
        }

        layer.getPatternPlugin('ring').apply(shape);
        x = shape.x();
        y = shape.y();

        shape.position(x, y, z);
    }
});
