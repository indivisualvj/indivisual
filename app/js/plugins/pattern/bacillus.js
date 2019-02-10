HC.plugins.pattern.bacillus = _class(false, HC.PatternPlugin, {
    name: 'bacillus',
    injections: {velocity: false},

    apply: function (shape, move) {
        var layer = this.layer;


        var speed = layer.getShapeSpeed(shape);
        var params = this.params(shape);

        var prcp = layer.resolution().x / 600;
        var prcn = prcp * -1;

        var avx = randomInt(prcn, prcp) / shape.size() * this.settings.pattern_padding * this.settings.pattern_paddingx;
        var avy = randomInt(move === true ? 0 : prcn, prcp) / shape.size() * this.settings.pattern_padding * this.settings.pattern_paddingy;
        var avz = randomInt(prcn, prcp) / shape.size() * this.settings.pattern_padding * this.settings.pattern_paddingz;

        if (!params.velocity) {
            params.velocity = new THREE.Vector3(avx, avy, avz);

            shape.position().copy(layer.random2dPosition(0), layer.shapeSize(1));
        }

        var mpc = animation.diffPrc * 0.3;
        var accelerator = audio.peak ? 3.5 : 2.5;

        params.velocity.x += mpc * avx;
        params.velocity.x *= (audio.peak || speed.progress <= 0) ? accelerator * this.settings.pattern_padding : 0.90;

        // verlangsamen
        if (Math.abs(params.velocity.x) > prcp * 10) {
            params.velocity.x *= 0.7;
            params.velocity.y *= 0.7;
            params.velocity.z *= 0.7;

        } else if (Math.abs(params.velocity.x) > prcp * 8) {
            params.velocity.x *= 0.8;
            params.velocity.y *= 0.8;
            params.velocity.z *= 0.8;
        }

        params.velocity.y += mpc * avy;
        params.velocity.y *= (audio.peak || speed.progress <= 0) ? accelerator * this.settings.pattern_padding : 0.90;

        // verlangsamen
        if (Math.abs(params.velocity.y) > prcp * 10) {
            params.velocity.y *= 0.7;
            params.velocity.x *= 0.7;
            params.velocity.z *= 0.7;

        } else if (Math.abs(params.velocity.y) > prcp * 8) {
            params.velocity.y *= 0.8;
            params.velocity.x *= 0.8;
            params.velocity.z *= 0.8;
        }

        params.velocity.z += mpc * avz;
        params.velocity.z *= (audio.peak || speed.progress <= 0) ? accelerator * this.settings.pattern_padding : 0.90;

        // verlangsamen
        if (Math.abs(params.velocity.z) > prcp * 10) {
            params.velocity.y *= 0.7;
            params.velocity.x *= 0.7;
            params.velocity.z *= 0.7;

        } else if (Math.abs(params.velocity.z) > prcp * 8) {
            params.velocity.y *= 0.8;
            params.velocity.x *= 0.8;
            params.velocity.z *= 0.8;
        }

        if (move === true) {

            var dir = this.boundsCheck(shape, layer.shapeSize(shape.size()));
            if (dir.x < 0) {
                shape.x(-layer.shapeSize(shape.size()));
            } else if (dir.x > 0) {
                shape.x(layer.resolution().x + layer.shapeSize(shape.size()));
            }
            if (dir.y > 0) {
                shape.y(-layer.shapeSize(shape.size()));
            } else if (dir.y < 0) {
                shape.y(layer.resolution().y + layer.shapeSize(shape.size()));
            }

            var a = shape.rotation().z;
            shape.move(
                params.velocity.y * Math.sin(a),
                -params.velocity.y * Math.cos(a),
                0
            );

        } else {
            this.boundsCheck(shape, 0, .75, params.velocity);
            shape.position().add(params.velocity);
        }
    }
});

HC.plugins.pattern.rocket = _class(false, HC.PatternPlugin, {
    name: 'rocket',

    apply: function (shape) {
        var layer = this.layer;
        layer.getPatternPlugin('bacillus').apply(shape, true);
    }
});