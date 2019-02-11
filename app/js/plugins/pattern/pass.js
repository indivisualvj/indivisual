HC.plugins.pattern.pass = _class(
    function () {
        this.dir = 1;
    }, HC.PatternPlugin, {
        name: 'pass horizontal',
        injections: {
            velocity: false
        },

        before: function (shape) {
            var params = this.params(shape);
            if (!params.velocity) {
                var matrix = this.layer.getPatternPlugin('matrix');
                matrix.apply(shape);
            }
        },

        apply: function (shape, peak) {
            var layer = this.layer;
            var matrix = layer.getPatternPlugin('matrix');
            var gridPosition = matrix.gridPosition(shape);
            var params = this.params(shape);
            var shapeSpeed = layer.getShapeRhythmPlugin(this.settings.shape_rhythm).params(shape);

            if (this.isFirstShape(shape) && randomBool()) {
                if ((!peak && layer.getCurrentSpeed().prc == 0) || (peak && audio.peak)) {
                    this.dir = randomBool() ? -1 : 1;
                }
            }
            if (!params.velocity || shapeSpeed.prc == 0) {
                params.velocity = randomFloat(2, 3, 3);
            }

            var dir = (gridPosition.y % 2 ? -1 : 1) * this.dir;
            var step = animation.diffPrc * dir * params.velocity * layer.resolution('relative').x;
            step *= this.settings.pattern_paddingx;
            shape._position.translateX(step);

            var shapeSize = layer.shapeSize(shape.size());
            if (dir < 0 && shape.position().x < -shapeSize) {
                shape.position().x = layer.resolution().x + shapeSize;
            } else if (dir > 0 && shape.position().x > layer.resolution().x + shapeSize) {
                shape.position().x = -shapeSize;
            }
        }
    }
);