HC.plugins.pattern.dropletsv = _class(false, HC.PatternPlugin, {
    name: 'dropletsv',
    injections: {velocity: false},

    apply(shape) {
        var layer = this.layer;


        var params = this.params(shape);

        if (shape.y() < 0 - layer.shapeSize(1) || shape.y() > layer.resolution().y + layer.shapeSize(1)) {
            params.velocity = 0;
        }

        if (!params.velocity || Math.abs(params.velocity) < 0.001) {

            layer.getPatternPlugin('lineh').apply(shape);
            if (randomInt(0, 15) == 0) {
                params.velocity = randomFloat(1.11, 1.66, 2, true);

            } else {
                return;
            }
        }

        var speed = params.velocity;
        var acc = 1.05;// * animation.diff / 20;
        speed *= acc * this.settings.pattern_paddingy * this.settings.pattern_padding;
        params.velocity = speed;

        shape.y(shape.y() + speed);
    }
});

HC.plugins.pattern.dropletsh = _class(false, HC.PatternPlugin, {
    name: 'dropletsh',
    injections: {velocity: false},

    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);

        if (shape.x() < 0 - layer.shapeSize(1) || shape.x() > layer.resolution().x + layer.shapeSize(1)) {
            params.velocity = 0;
        }

        if (!params.velocity || Math.abs(params.velocity) < 0.001) {

            layer.getPatternPlugin('linev').apply(shape);
            if (randomInt(0, 15) == 0) {
                params.velocity = randomFloat(1.11, 1.66, 2, true);

            } else {
                return;
            }
        }

        var speed = params.velocity;
        var acc = 1.05;// * animation.diff / 20;
        speed *= acc * this.settings.pattern_paddingx * this.settings.pattern_padding;
        params.velocity = speed;

        shape.x(shape.x() + speed);
    }
});