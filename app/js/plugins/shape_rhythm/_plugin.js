HC.plugins.shape_rhythm = HC.plugins.shape_rhythm || {};
{
    HC.ShapeRhythmPlugin = class Plugin extends HC.AnimationPlugin {

        before(shape) {
            if (shape.dummy) { // no special speed for pattern rotation
                this.params(shape).speed = beatkeeper.getSpeed(this.settings.rhythm);
                this.after(shape);
                return false;
            }
        }

        after(shape) {
            var params = this.params(shape);
            params.duration = params.speed.duration;
            params.progress = 0;
            params.prc = 0;

            params.duration -= params.duration * params.speed.prc; // adjust to keep in phase
            params.duration = Math.max(params.duration, 1); // set minimum duration to 1
        }

        update(shape, diff) {
            var params = this.params(shape);
            params.progress += diff;
            if (params.progress > params.duration) {
                params.progress = params.duration;
            }
            params.prc = Math.min(1.0, params.progress / params.duration);

        }

        starting(shape) {
            var params = this.params(shape);
            return params.prc == 0;
        }

        finished(shape) {
            var params = this.params(shape);
            return params.progress >= params.duration
        }

        isFirstShape(shape) {
            return shape.index == -1;
        }
    };

    HC.ShapeRhythmPlugin.prototype.injections = {// todo move into class after all is "classified"
        speed: false,
        duration: 0,
        progress: 0,
        prc: 0
    }
}