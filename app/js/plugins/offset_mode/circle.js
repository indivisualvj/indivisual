HC.plugins.offset_mode.circle = _class(function () {
        this.angle = 0;
    }, HC.OffsetModePlugin, {
        name: 'circle',
        apply: function (shape, chess) {
            var layer = this.layer;
            var speed = layer.getShapeSpeed(shape);
            if (this.isFirstShape(shape)) {
                this.angle += animation.diff / speed.duration * 90;
            }
            var va = this.angle + 360 / layer.shapeCount() * shape.index;

            va = va > 360 ? va - 360 : va;

            var x = this.settings.offset_x * Math.sin(RAD * va) * layer.shapeSize(.5);
            var y = this.settings.offset_y * Math.cos(RAD * va) * layer.shapeSize(.5);
            var z = this.settings.offset_z * Math.cos(RAD * (90 + va)) * layer.shapeSize(.5);

            if (chess && shape.index % 2 == 0) {
                x *= -1;
                y *= -1;
                z *= -1;
            }

            shape.offset(x, y, z);

        }
    }
);

HC.plugins.offset_mode.circle2 = _class(false, HC.OffsetModePlugin, {
    name: 'circle chess',
    apply: function (shape) {
        var layer = this.layer;
        layer.getOffsetModePlugin('circle').apply(shape, true);
    }
});

HC.plugins.offset_mode.rumble = _class(false, HC.OffsetModePlugin, {

    injections: {
        angle: false,
        multiplier: false,
        rumble: {
            x: false,
            y: false,
            z: false
        },

    },
    apply: function (shape, onpeak) {
        var layer = this.layer;

        var speed = layer.getShapeSpeed(shape);
        var params = this.params(shape);

        if (!params.angle) {
            params.angle = 360;
            params.rumble.x = 0;
            params.rumble.y = 0;
            params.rumble.z = 0;
            params.multiplier = 0;
        }
        params.angle += animation.diff / speed.duration * randomInt(-45, 45);
        params.rumble.x += animation.diff / speed.duration * randomInt(-45, 45);
        params.rumble.y += animation.diff / speed.duration * randomInt(-45, 45);
        params.rumble.z += animation.diff / speed.duration * randomInt(-45, 45);

        var va = params.angle;

        va = va > 360 ? va - 360 : va;

        var sttngs = {
            osci1_period: 0.005,
            osci1_amp: 1,
            osci2_period: 0.05,
            osci2_amp: 1,
            osci3_period: 0.01,
            osci3_amp: 1,
            rhythm: 'half'
        };

        var multiplier = 0.5;

        if (onpeak) {

            var reduce = params.multiplier > 0;

            if (audio.peak || (this.settings.offset_sync && speed.prc <= 0)) {
                reduce = true;
                if (params.multiplier <= 0) {
                    params.multiplier = 1;

                }
            }

            // reduce
            if (reduce) {
                params.multiplier -= 1.25 * animation.diff / speed.duration;
                if (params.multiplier < 0) {
                    params.multiplier = 0;
                }
            }

            multiplier = params.multiplier;

        }

        var w1 = multiplier * HC.Osci.wobble(params.rumble.x, sttngs);
        var w2 = multiplier * HC.Osci.wobble(params.rumble.y, sttngs);
        var w3 = multiplier * HC.Osci.wobble(params.rumble.z, sttngs);

        var m = layer.shapeSize(4);

        var x = this.settings.offset_x * Math.sin(RAD * w1) * m;
        var y = this.settings.offset_y * Math.sin(RAD * w2) * m;
        var z = this.settings.offset_z * Math.sin(RAD * w3) * m;

        shape.offset(x, y, z);
    }
});

HC.plugins.offset_mode.rumblepeak = _class(false, HC.OffsetModePlugin, {
    name: 'rumble on peak',
    apply: function (shape) {
        var layer = this.layer;
        layer.getOffsetModePlugin('rumble').apply(shape, true);
    }
});
