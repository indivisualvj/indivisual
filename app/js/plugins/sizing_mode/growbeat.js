{
    HC.plugins.sizing_mode.growbeat = class Plugin extends HC.SizingModePlugin {
        injections = {active: false, since: 0};

        apply(shape) {
            let layer = this.layer;
            let speed = layer.getShapeSpeed(shape);

            let params = this.params(shape);
            let s = 0.01;
            // do not grow
            if (params.active < 0.1) {

                // when to start growing?
                if ((this.audioAnalyser.peak && randomInt(0, this.settings.sizing_mode_sync ? 2 : 6) === 0)
                    || (this.audioAnalyser.volume > 0.05 && speed.progress <= 0 && randomInt(0, this.settings.sizing_mode_sync ? 2 : layer.shapeCount()) === 0)
                ) {
                    params.active = this.settings.sizing_mode_limit ? 0.09 : 0.11;
                    params.since = this.animation.now;
                }

                let mul = this.settings.sizing_scale;

                if (this.settings.sizing_mode_audio == true) {
                    mul *= (this.settings.sizing_mode_sync == false ? this.shapeVolume(shape) : this.audioAnalyser.volume * 2);
                }

                if (this.settings.sizing_mode_limit == true) {
                    mul = Math.min(1, Math.max(-1, mul));
                }

                let d = params.active ? params.active : (params.active = 0.09);

                d *= mul;
                s = (Math.abs(d) < 0.001 ? 0.001 : d);

                // grow
            } else {

                let speed = layer.getShapeSpeed(shape);
                let jump = 1 / speed.duration * this.animation.diffPrc;

                params.active += jump * 60 * this.settings.sizing_scale;

                let diff = this.animation.now - params.since;
                if (diff > speed.duration * 4 / this.settings.sizing_scale) {
                    params.active = 0.09;
                }

                let d = params.active ? params.active : (params.active = 0.09);

                s = (Math.abs(d) < 0.001 ? 0.001 : d);
            }

            let x = this.settings.sizing_x * s;
            let y = this.settings.sizing_y * s;
            let z = this.settings.sizing_z * s;

            shape.scale(x, y, z);
        }
    }
}
