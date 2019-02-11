HC.plugins.shape_delay = HC.plugins.shape_delay || {};

HC.ShapeDelayPlugin = _class(false, HC.Plugin, {
    injections: {
        delay: 0
    },
    before: function (shape) {
        var params = this.params(shape);
        params.delay = 0;

        // no special speed for pattern rotation
        if (this.isFirstShape(shape)) {
            return false;
        }
    },
    after: function (shape) {
        var layer = this.layer;
        var params = this.params(shape);
        var rp = layer.getShapeSpeed(shape);

        params.delay -= params.delay * rp.speed.prc;
        params.delay = clamp(params.delay, 0, rp.duration); // bondage to 0 or duration ...
        rp.duration -= params.delay; // ... so that duration can't be less than 0

    },

    update: function (shape, diff) {
        this.params(shape).delay -= diff;
    },

    finished: function (shape) {
        var params = this.params(shape);
        return !(params.delay > 0);
    },

    isFirstShape: function (shape) {
        return shape.index == -1;
    }
});