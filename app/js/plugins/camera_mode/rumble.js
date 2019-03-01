HC.plugins.camera_mode.rumble = _class(
    function () {
        this.params = {
            multiplier: false,
            rumble: {
                x: false,
                y: false,
                z: false
            }
        };
    }, HC.CameraModePlugin, {
        name: 'static rumble',
        apply(peak) {
            var layer = this.layer;
            var speed = beatkeeper.getDefaultSpeed();
            var params = this.params;

            if (params.multiplier === false) {
                params.rumble.x = 0;
                params.rumble.y = 0;
                params.rumble.z = 0;
                params.multiplier = 0;
            }
            params.rumble.x += animation.diffPrc * randomInt(-45, 45);
            params.rumble.y += animation.diffPrc * randomInt(-45, 45);
            params.rumble.z += animation.diffPrc * randomInt(-45, 45);

            var sttngs = {
                osci1_period: 0.005,
                osci1_amp: 1,
                osci2_period: 0.05,
                osci2_amp: 1,
                osci3_period: 0.01,
                osci3_amp: 1,
                rhythm: 'half'
            };

            var reduce = params.multiplier > 0;

            if ((peak && audio.peak) || (!peak && speed.prc == 0)) {
                reduce = true;
                if (params.multiplier <= 0) {
                    params.multiplier = 1;

                }
            }

            // reduce
            if (reduce) {
                params.multiplier -= 0.1 * animation.diffPrc;
                if (params.multiplier < 0) {
                    params.multiplier = 0;
                }
            }

            var multiplier = params.multiplier;

            var w1 = multiplier * HC.Osci.wobble(params.rumble.x, sttngs);
            var w2 = multiplier * HC.Osci.wobble(params.rumble.y, sttngs);
            var w3 = multiplier * HC.Osci.wobble(params.rumble.z, sttngs);

            var m = layer.shapeSize(4);

            var x = this.settings.camera_mode_volume * Math.sin(RAD * w1) * m;
            var y = this.settings.camera_mode_volume * Math.sin(RAD * w2) * m;
            var z = this.settings.camera_mode_volume * Math.sin(RAD * w3) * m;

            var cam = layer.getCamera();
            layer.getCameraModePlugin('manual').apply();
            cam.zoom = 1;
            cam.position.add(new THREE.Vector3(x, y, z));
        }
    }
);

HC.plugins.camera_mode.rumblepeak = _class(false, HC.CameraModePlugin, {
    name: 'static rumble on peak',
    apply() {
        var layer = this.layer;

        layer.getCameraModePlugin('rumble').apply(true);
    }
});