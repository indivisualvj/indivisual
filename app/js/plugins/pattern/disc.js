HC.plugins.pattern.disc = _class(false, HC.PatternPlugin, {
    name: 'disc',
    injections: {shellIndex: false},

    apply: function (shape) {
        var layer = this.layer;
        var params = this.params(shape);

        var index = shape.index;
        var x = 0, y = 0, z = 0;

        if (index > 0) {

            var diameter = layer.shapeSize(SQUARE_DIAMETER);

            if (!params.shellIndex) {

                var shellIndex = 1;
                var shapesOnShell = 0;
                var shapesOnShells = 0;

                while (shapesOnShells < index) {
                    var circum = 2 * Math.PI * (diameter * shellIndex);
                    shapesOnShell = Math.floor(circum / diameter);
                    var segment = 360 / shapesOnShell * RAD;

                    shapesOnShells += shapesOnShell;

                    if (index <= shapesOnShells) {
                        var shellPosition = shapesOnShell - (shapesOnShells - index) - 1;

                        params.shellIndex = shellIndex;
                        params.shellAngle = segment * shellPosition;
                    }

                    shellIndex++;
                }
            }

            var radius = diameter * params.shellIndex;
            var angle = params.shellAngle;

            x = Math.sin(angle) * radius * this.settings.pattern_paddingx;
            y = Math.cos(angle) * radius * this.settings.pattern_paddingy;
            z = 0;

        }

        layer.positionIn3dSpace(shape, x, y, z);
    }
});

HC.plugins.pattern.gear = _class(false, HC.PatternPlugin, {
    name: 'gear',

    apply: function (shape) {
        var layer = this.layer;
        layer.getPatternPlugin('disc').apply(shape);
    }
});