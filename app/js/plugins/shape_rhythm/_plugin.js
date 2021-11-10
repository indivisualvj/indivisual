HC.plugins.shape_rhythm = HC.plugins.shape_rhythm || {};
{
    HC.ShapeRhythmPlugin = class Plugin extends HC.AnimationPlugin {

        injections = {
            speed: false,
            duration: 0,
            progress: 0,
            prc: 0
        };

        setControlSets(controlSets) {
            super.setControlSets(controlSets);
            // make all such plugins make use of corresponding controlset only
            this.settings = controlSets.shape.properties;
        }

        before(shape) {
            if (!shape.isVisible()) { // no special speed for pattern rotation
                this.params(shape).speed = this.beatKeeper.getSpeed(this.controlSets['audio'].get('rhythm'));
                this.after(shape);
                return false;
            }
        }

        after(shape) {
            let params = this.params(shape);
            params.duration = params.speed.duration;
            params.progress = 0;
            params.prc = 0;

            params.duration -= params.duration * params.speed.prc; // adjust to keep in phase
            params.duration = Math.max(params.duration, 1); // set minimum duration to 1
        }

        update(shape, diff) {
            let params = this.params(shape);
            params.progress += diff;
            if (params.progress > params.duration) {
                params.progress = params.duration;
            }
            params.prc = Math.min(1.0, params.progress / params.duration);

        }

        starting(shape) {
            let params = this.params(shape);
            return params.prc === 0;
        }

        finished(shape) {
            let params = this.params(shape);
            return params.progress >= params.duration
        }

        isFirstShape(shape) {
            return shape.index == -1;
        }
    }
}
