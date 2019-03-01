HC.plugins.shape_rhythm.random = _class(false, HC.ShapeRhythmPlugin, {
    apply(shape, overwrite) {
        var params = this.params(shape);
        if (!params.speed || overwrite) {
            var keys = Object.keys(beatkeeper.speeds);
            var i = randomInt(2, keys.length - 2);
            var speed = keys[i];
            params.speed = beatkeeper.getSpeed(speed);
        }
    }
});