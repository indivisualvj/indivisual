{
    HC.plugins.offset_mode.circle = class Plugin extends HC.OffsetModePlugin {
        static name = 'circle';
        angle = 0;

        apply(shape, chess) {
            let layer = this.layer;
            let speed = layer.getShapeSpeed(shape);
            if (this.isFirstShape(shape)) {
                this.angle += this.animation.diff / speed.duration * 90;
            }
            let va = this.angle + 360 / layer.shapeCount() * shape.index;

            va = va > 360 ? va - 360 : va;

            let x = this.settings.offset_x * Math.sin(RAD * va) * layer.shapeSize(.5);
            let y = this.settings.offset_y * Math.cos(RAD * va) * layer.shapeSize(.5);
            let z = this.settings.offset_z * Math.cos(RAD * (90 + va)) * layer.shapeSize(.5);

            if (chess && shape.index % 2 === 0) {
                x *= -1;
                y *= -1;
                z *= -1;
            }

            shape.offset(x, y, z);
        }
    }
}
{
    HC.plugins.offset_mode.circle2 = class Plugin extends HC.OffsetModePlugin {
        static name = 'circle chess';

        apply(shape) {
            let layer = this.layer;
            layer.getOffsetModePlugin('circle').apply(shape, true);
        }
    }
}
{
    HC.plugins.offset_mode.rumble = class Plugin extends HC.OffsetModePlugin {

        injections = {
            angle: false,
            multiplier: false,
            rumble: {
                x: false,
                y: false,
                z: false
            }
        };

        apply(shape, onpeak) {
            let layer = this.layer;

            let speed = layer.getShapeSpeed(shape);
            let params = this.params(shape);

            if (!params.angle) {
                params.angle = 360;
                params.rumble.x = 0;
                params.rumble.y = 0;
                params.rumble.z = 0;
                params.multiplier = 0;
            }
            params.angle += this.animation.diff / speed.duration * randomInt(-45, 45);
            params.rumble.x += this.animation.diff / speed.duration * randomInt(-45, 45);
            params.rumble.y += this.animation.diff / speed.duration * randomInt(-45, 45);
            params.rumble.z += this.animation.diff / speed.duration * randomInt(-45, 45);

            let va = params.angle;

            // va = va > 360 ? va - 360 : va;

            let sttngs = {
                osci1_period: 0.005,
                osci1_amp: 1,
                osci2_period: 0.05,
                osci2_amp: 1,
                osci3_period: 0.01,
                osci3_amp: 1,
                rhythm: 'half',
                tempo: this.config.ControlSettings.tempo
            };

            let multiplier = 0.5;

            if (onpeak) {

                let reduce = params.multiplier > 0;

                if (this.audioAnalyser.peak || (this.settings.offset_sync && speed.prc <= 0)) {
                    reduce = true;
                    if (params.multiplier <= 0) {
                        params.multiplier = 1;

                    }
                }

                // reduce
                if (reduce) {
                    params.multiplier -= 1.25 * this.animation.diff / speed.duration;
                    if (params.multiplier < 0) {
                        params.multiplier = 0;
                    }
                }

                multiplier = params.multiplier;

            }

            let w1 = multiplier * HC.Osci.wobble(this.beatKeeper, params.rumble.x, sttngs);
            let w2 = multiplier * HC.Osci.wobble(this.beatKeeper, params.rumble.y, sttngs);
            let w3 = multiplier * HC.Osci.wobble(this.beatKeeper, params.rumble.z, sttngs);

            let m = layer.shapeSize(4);

            let x = this.settings.offset_x * Math.sin(RAD * w1) * m;
            let y = this.settings.offset_y * Math.sin(RAD * w2) * m;
            let z = this.settings.offset_z * Math.sin(RAD * w3) * m;

            shape.offset(x, y, z);
        }
    }
}
{
    HC.plugins.offset_mode.rumblepeak = class Plugin extends HC.OffsetModePlugin {
        static name = 'rumble on peak';

        apply(shape) {
            let layer = this.layer;
            layer.getOffsetModePlugin('rumble').apply(shape, true);
        }
    }
}
