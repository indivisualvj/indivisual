HC.plugins.pattern.flow = _class(false, HC.PatternPlugin, {
    name: 'flow',
    injections: {
        velocity: {
            x: false,
            y: false,
            z: false
        }
    },

    apply: function (shape) {
        var layer = this.layer;


        var params = this.params(shape);
        var matrix = layer.getPatternPlugin('matrix');
        var gridPosition = matrix.gridPosition(shape);
        var gap = layer.shapeSize(1) * this.settings.pattern_padding;
        var ox = (layer.patternCenterX() * 2 - gap * matrix.columnCount(layer)) / 2 - layer.shapeSize(.5);
        var x = 0, y = 0, z = 0;

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

        var vx = params.velocity.x * animation.diff * this.settings.pattern_paddingx;
        var vy = params.velocity.y * animation.diff * this.settings.pattern_paddingy;
        var vz = params.velocity.z * animation.diff * this.settings.pattern_paddingz;

        shape.move(vx, vy, vz);
    }
});