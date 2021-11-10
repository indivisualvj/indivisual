{
    HC.plugins.camera_mode.rumble = class Plugin extends HC.CameraModePlugin {
        static name = 'static rumble';
        params = {
            multiplier: false,
            rumble: {
                x: false,
                y: false,
                z: false
            }
        };

        apply(peak) {
            let layer = this.layer;
            let speed = this.beatKeeper.getDefaultSpeed();
            let params = this.params;

            if (params.multiplier === false) {
                params.rumble.x = 0;
                params.rumble.y = 0;
                params.rumble.z = 0;
                params.multiplier = 0;
            }
            params.rumble.x += this.animation.diffPrc * randomInt(-45, 45);
            params.rumble.y += this.animation.diffPrc * randomInt(-45, 45);
            params.rumble.z += this.animation.diffPrc * randomInt(-45, 45);

            let sttngs = {
                osci1_period: 0.005,
                osci1_amp: 1,
                osci2_period: 0.05,
                osci2_amp: 1,
                osci3_period: 0.01,
                osci3_amp: 1,
                rhythm: 'half'
            };

            let reduce = params.multiplier > 0;

            if ((peak && this.audioAnalyser.peak) || (!peak && speed.prc === 0)) {
                reduce = true;
                if (params.multiplier <= 0) {
                    params.multiplier = 1;

                }
            }

            // reduce
            if (reduce) {
                params.multiplier -= 0.1 * this.animation.diffPrc;
                if (params.multiplier < 0) {
                    params.multiplier = 0;
                }
            }

            let multiplier = params.multiplier;

            let w1 = multiplier * HC.Osci.wobble(this.beatKeeper, params.rumble.x, sttngs);
            let w2 = multiplier * HC.Osci.wobble(this.beatKeeper, params.rumble.y, sttngs);
            let w3 = multiplier * HC.Osci.wobble(this.beatKeeper, params.rumble.z, sttngs);

            let m = layer.shapeSize(4);

            let x = this.settings.camera_mode_volume * Math.sin(RAD * w1) * m;
            let y = this.settings.camera_mode_volume * Math.sin(RAD * w2) * m;
            let z = this.settings.camera_mode_volume * Math.sin(RAD * w3) * m;

            let cam = layer.getCamera();
            layer.getCameraModePlugin('manual').apply();
            cam.zoom = 1;
            cam.position.add(new THREE.Vector3(x, y, z));
        }
    }
}
{
    HC.plugins.camera_mode.rumblepeak = class Plugin extends HC.CameraModePlugin {
        static name = 'static rumble on peak';

        apply() {
            let layer = this.layer;

            layer.getCameraModePlugin('rumble').apply(true);
        }
    }
}
