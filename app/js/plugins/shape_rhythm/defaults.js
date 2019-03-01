HC.plugins.shape_rhythm.nochange = _class(false, HC.ShapeRhythmPlugin, {
    index: 1,
    name: 'no change',
    apply(shape) {
        var layer = this.layer;
        this.params(shape).speed = layer.getCurrentSpeed();
    }
});

HC.plugins.shape_rhythm.double = _class(false, HC.ShapeRhythmPlugin, {
    index: 2,
    name: 'double',
    apply(shape) {
        this.params(shape).speed = beatkeeper.getSpeed('double');
    }
});

HC.plugins.shape_rhythm.full = _class(false, HC.ShapeRhythmPlugin, {
    index: 3,
    name: 'full',
    apply(shape) {
        this.params(shape).speed = beatkeeper.getSpeed('full');
    }
});

HC.plugins.shape_rhythm.half = _class(false, HC.ShapeRhythmPlugin, {
    index: 4,
    name: 'half',
    apply(shape) {
        this.params(shape).speed = beatkeeper.getSpeed('half');
    }
});

HC.plugins.shape_rhythm.quarter = _class(false, HC.ShapeRhythmPlugin, {
    index: 5,
    name: 'quarter',
    apply(shape) {
        this.params(shape).speed = beatkeeper.getSpeed('quarter');
    }
});
