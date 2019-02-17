
HC.plugins.shape_rhythm.random = _class(false, HC.ShapeRhythmPlugin, {
    apply: function (shape, overwrite) {
        var layer = this.layer;
        var params = this.params(shape);
        if (!params.speed || overwrite) {
            var keys = Object.keys(beatkeeper.speeds);
            var i = randomInt(2, keys.length - 2);
            var speed = keys[i];
            params.speed = beatkeeper.getSpeed(speed);
        }
    }
});

HC.plugins.shape_rhythm.randompeak = _class(
    function () {
        this.peak = false;
        var inst = this;
        listener.register('AudioAnalyser.peak', 'HC.plugins.shape_rhythm.randompeak', function () {
            inst.peak = randomBool();

        });
    }, HC.ShapeRhythmPlugin, {
        apply: function (shape) {
            var layer = this.layer;
            var params = this.params(shape);
            if (!params.speed || this.peak) {
                var random = layer.getShapeRhythmPlugin('random');
                random.apply(shape, true);
                this.params(shape).speed = random.params(shape).speed;
            }
        }
    }
);