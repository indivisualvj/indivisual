HC.plugins.pattern.sphere = _class(false, HC.PatternPlugin, {
    name: 'sphere',
    points: {},

    apply: function (shape) {
        var layer = this.layer;


        var point = this.spherePosition(shape);
        var radius = layer.resolution('half').y * this.settings.pattern_padding;

        if (this.settings.pattern_audio) {
            var or = radius;
            if (this.settings.pattern_sync) {
                radius *= audio.volume;
            } else {
                radius *= shape.shapeVolume();
            }

            if (this.settings.pattern_limit) {
                radius = or + radius;
            }
        }

        var px = this.settings.pattern_paddingx;
        var py = this.settings.pattern_paddingy;
        var pz = this.settings.pattern_paddingz;
        var x = point.x * radius * px;
        var y = point.y * radius * py;
        var z = point.z * radius * pz;

        layer.positionIn3dSpace(shape, x, y, z);
    },

    getDistributionOnSphere: function (n) {
        var rnd = 1;
        var offset = 2 / n;
        var increment = Math.PI * (3 - Math.sqrt(5));

        return Array(n).fill(null).map(function (_, i) {
            var y = i * offset - 1 + offset / 2;
            var r = Math.sqrt(1 - Math.pow(y, 2));
            var phi = (i + rnd) % n * increment;

            return {
                x: Math.cos(phi) * r,
                z: Math.sin(phi) * r,
                y: y
            };

        });
    },

    spherePosition: function (shape) {
        var layer = this.layer;
        if (!this.points || this.points.length != layer.shapeCount()) {
            this.points = this.getDistributionOnSphere(layer.shapeCount());
        }

        return this.points[shape.index];
    }
});

HC.plugins.pattern.spray = _class(false, HC.PatternPlugin, {
    name: 'spray',
    injections: {initial: false, velocity: false},

    apply: function (shape) {
        var layer = this.layer;



        var params = this.params(shape);

        if (!params.initial
            || shape.y() < 0 - layer.shapeSize(1)
            || shape.y() > layer.resolution().y + layer.shapeSize(1)
            || shape.x() < 0 - layer.shapeSize(1)
            || shape.x() > layer.resolution().x + layer.shapeSize(1)
        ) {
            layer.getPatternPlugin('sphere').apply(shape);
            var sp = shape.position().clone();
            var cv = layer.patternCenterVector(true);
            sp.sub(cv);
            params.initial = sp;
            shape.position().copy(cv);

            params.velocity = randomFloat(0.1, 1, 2, false);
        }

        var v = this.settings.pattern_audio == true
            ? ((this.settings.pattern_sync == false
                ? shape.shapeVolume() : audio.volume) * this.settings.pattern_padding) : 1;

        if (audio.peak) {
            params.velocity *= 1.5;

        } else if (params.velocity > 1.5) {
            params.velocity *= 0.9;
        }

        var frame = params.velocity * animation.diff / 350;

        shape.move(
            params.initial.x * frame,
            params.initial.y * -frame,
            params.initial.z * frame
        );
    }
});

HC.plugins.pattern.pulse = _class(false, HC.PatternPlugin, {
    name: 'pulse',
    injections: {
        initial: false,
        velocity: false,
        volume: false
    },
    apply: function (shape) {
        var layer = this.layer;


        var params = this.params(shape);

        if (!params.initial // wenn man immer da rein fällt gibts ein tolles gerumble!
            || shape.y() < 0 - layer.shapeSize(1)
            || shape.y() > layer.resolution().y + layer.shapeSize(1)
            || shape.x() < 0 - layer.shapeSize(1)
            || shape.x() > layer.resolution().x + layer.shapeSize(1)
            || shape.z() > layer.cameraDefaultDistance()
            || shape.z() < -layer.cameraDefaultDistance()
        ) {
            layer.getPatternPlugin('sphere').apply(shape);
            var sp = shape.position().clone();
            var cv = layer.patternCenterVector(true);
            sp.sub(cv);
            params.initial = sp;
            shape.position().copy(cv);

            params.velocity = randomFloat(.1, 1, 2);

        }

        var speed = layer.getShapeSpeed(shape);
        if (speed.progress < 1) { //
            params.velocity *= -1;

        } else if (audio.isActive) {
            if (audio.peak) {
                params.volume = this.settings.pattern_sync == false
                    ? shape.shapeVolume() : audio.volume;
                params.velocity *= -1;

            } else if (params.volume > 0) {
                params.volume -= 0.00001 * animation.diff;
            }
        }

        var frame = params.velocity * animation.diff / 250;

        shape.move(
            params.initial.x * frame,
            params.initial.y * -frame,
            params.initial.z * frame
        );
    }
});

HC.plugins.pattern.drift = _class(false, HC.PatternPlugin, {
    name: 'drift',

    apply: function (shape) {
        var layer = this.layer;
        layer.getPatternPlugin('spray').apply(shape);
    }
});