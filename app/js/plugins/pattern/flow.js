{
    HC.plugins.pattern.flow = class Plugin extends HC.PatternPlugin {
        static name = 'flow';
        injections = {
            velocity: {
                x: false,
                y: false,
                z: false
            }
        };

        apply(shape) {
            let layer = this.layer;


            let params = this.params(shape);
            let matrix = layer.getPatternPlugin('matrix');
            let gridPosition = matrix.gridPosition(shape);
            let gap = layer.shapeSize(1) * this.settings.pattern_padding;
            let ox = (layer.patternCenterX() * 2 - gap * matrix.columnCount(layer)) / 2 - layer.shapeSize(.5);
            let x = 0, y = 0, z = 0;

            if (!params.velocity.y) {
                x = ox + gridPosition.x * gap;
                y = (randomInt(-layer.shapeSize(1), layer.resolution().y, false));
                z = 0;
                shape.position(x, y, z);
                params.velocity.x = randomFloat(-0.04, 0.05, 3, true);
                params.velocity.y = randomFloat(0.03, 0.4, 3, false);
                params.velocity.z = randomFloat(0.03, 0.4, 3, true);

            } else if (shape.y() < -layer.shapeSize(1)) {
                x = ox + gridPosition.x * gap;
                y = (layer.resolution().y + layer.shapeSize(1));
                z = 0;
                shape.position(x, y, z);
                params.velocity.x = randomFloat(-0.04, 0.05, 3, true);
                params.velocity.y = randomFloat(0.03, 0.4, 3, false);
                params.velocity.z = randomFloat(0.03, 0.4, 3, true);

            } else if (shape.y() > layer.resolution().y + layer.shapeSize(1)) {
                x = ox + gridPosition.x * gap;
                y = (0 - layer.shapeSize(1));
                z = 0;
                shape.position(x, y, z);
                params.velocity.x = randomFloat(-0.04, 0.05, 3, true);
                params.velocity.y = randomFloat(0.03, 0.4, 3, false);
                params.velocity.z = randomFloat(0.03, 0.4, 3, true);
            }

            let vx = params.velocity.x * animation.diff * this.settings.pattern_paddingx;
            let vy = params.velocity.y * animation.diff * this.settings.pattern_paddingy;
            let vz = params.velocity.z * animation.diff * this.settings.pattern_paddingz;

            shape.move(vx, vy, vz);
        }
    }
}