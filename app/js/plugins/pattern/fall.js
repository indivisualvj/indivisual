{
    HC.plugins.pattern.fall = class Plugin extends HC.PatternPlugin {
        static name = 'fall';
        injections = {
            velocity: {
                x: 1,
                y: 1
            },
            threshold: false
        };

        apply(shape) {
            var layer = this.layer;

            var params = this.params(shape);

            if (!params.threshold || shape.y() > layer.resolution().y + layer.shapeSize(1)) {
                var matrix = layer.getPatternPlugin('matrix');
                var gridPosition = matrix.gridPosition(shape);
                var gap = layer.shapeSize(1) * this.settings.pattern_paddingy;
                var ox = (layer.patternCenterX() * 2 - gap * matrix.columnCount(layer)) / 2 - layer.shapeSize(.5);
                var x = ox + gridPosition.x * gap;
                shape.x(x);
                shape.y(layer.shapeSize(.5));

                shape.z(-1000);
                params.threshold = layer.shapeSize(1);
                params.velocity.x = 0;
                params.velocity.y = 0.05;
            }

            if (params.velocity.y > 0
                && shape.y() < layer.resolution().y - layer.shapeSize(3)
                && shape.y() - params.threshold > layer.resolution().y / 8
                && 15 == randomInt(0, 15)
            ) {
                params.threshold = shape.y();
                params.velocity.y *= -0.1;
                var shapeDir = layer.getShapeDirection(shape);
                params.velocity.x += shapeDir * this.settings.pattern_paddingx * animation.diff / 50;

            } else {
                params.velocity.y += animation.diff / 20;
            }

            shape.move(
                params.velocity.x * animation.diff / 10,
                params.velocity.y * animation.diff / 150,
                0.5 * animation.diff
            );
        }
    }
}
{
    HC.plugins.pattern.stairs = class Plugin extends HC.plugins.pattern.fall {
        static name = 'stairs';

        apply(shape) {
            super.apply(shape, true);
        }
    }
}