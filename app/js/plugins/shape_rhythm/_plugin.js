HC.plugins.shape_rhythm = HC.plugins.shape_rhythm || {};

HC.ShapeRhythmPlugin = _class(false, HC.AnimationPlugin, {
    injections: {
        speed: false,
        duration: 0,
        progress: 0,
        prc: 0
    },
    before: function (shape) {
        if (shape.dummy) { // no special speed for pattern rotation
            this.params(shape).speed = beatkeeper.getSpeed(this.settings.rhythm);
            this.after(shape);
            return false;
        }
    },
    after: function (shape) {
        var params = this.params(shape);
        params.duration = params.speed.duration;
        params.progress = 0;
        params.prc = 0;

        params.duration -= params.duration * params.speed.prc; // adjust to keep in phase
        params.duration = Math.max(params.duration, 1); // set minimum duration to 1
    },

    update: function (shape, diff) {
        var params = this.params(shape);
        params.progress += diff;
        if (params.progress > params.duration) {
            params.progress = params.duration;
        }
        params.prc = Math.min(1.0, params.progress / params.duration);

    },

    starting: function (shape) {
        var params = this.params(shape);
        return params.prc == 0;
    },

    finished: function (shape) {
        var params = this.params(shape);
        return params.progress >= params.duration
    },

    isFirstShape: function (shape) {
        return shape.index == -1;
    }
});