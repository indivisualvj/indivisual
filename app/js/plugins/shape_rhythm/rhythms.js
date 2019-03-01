HC.plugins.shape_rhythm.doublequad = _class(false, HC.ShapeRhythmPlugin, {
    name: 'double/quad',
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        if (shape.index % 2 == 0) {
            params.speed = beatkeeper.speeds.double;

        } else {
            params.speed = beatkeeper.speeds.quad;
        }
    }
});

HC.plugins.shape_rhythm.quaddouble = _class(false, HC.ShapeRhythmPlugin, {
    name: 'quad/double',
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        if (shape.index % 2 == 0) {
            params.speed = beatkeeper.speeds.quad;

        } else {
            params.speed = beatkeeper.speeds.double;
        }
    }
});

HC.plugins.shape_rhythm.doublefull = _class(false, HC.ShapeRhythmPlugin, {
    name: 'double/full',
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        if (shape.index % 2 == 0) {
            params.speed = beatkeeper.speeds.double;

        } else {
            params.speed = beatkeeper.speeds.full;
        }
    }
});

HC.plugins.shape_rhythm.fulldouble = _class(false, HC.ShapeRhythmPlugin, {
    name: 'full/double',
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        if (shape.index % 2 == 0) {
            params.speed = beatkeeper.speeds.full;

        } else {
            params.speed = beatkeeper.speeds.double;
        }
    }
});

HC.plugins.shape_rhythm.fullhalf = _class(false, HC.ShapeRhythmPlugin, {
    name: 'full/half',
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        if (shape.index % 2 == 0) {
            params.speed = beatkeeper.speeds.full;

        } else {
            params.speed = beatkeeper.speeds.half;
        }
    }
});

HC.plugins.shape_rhythm.halffull = _class(false, HC.ShapeRhythmPlugin, {
    name: 'half/full',
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        if (shape.index % 2 == 1) {
            params.speed = beatkeeper.speeds.full;

        } else {
            params.speed = beatkeeper.speeds.half;
        }
    }
});

HC.plugins.shape_rhythm.halfquarter = _class(false, HC.ShapeRhythmPlugin, {
    name: 'half/quarter',
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        if (shape.index % 2 == 0) {
            params.speed = beatkeeper.speeds.half;

        } else {
            params.speed = beatkeeper.speeds.quarter;
        }
    }
});

HC.plugins.shape_rhythm.quarterhalf = _class(false, HC.ShapeRhythmPlugin, {
    name: 'quarter/half',
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        if (shape.index % 2 == 0) {
            params.speed = beatkeeper.speeds.quarter;

        } else {
            params.speed = beatkeeper.speeds.half;
        }
    }
});

HC.plugins.shape_rhythm.fullhalfquarter = _class(false, HC.ShapeRhythmPlugin, {
    name: 'full/half/quarter',
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        var mod = shape.index % 3;
        switch (mod) {
            case 0:
                params.speed = beatkeeper.speeds.full;
                break;

            case 1:
                params.speed = beatkeeper.speeds.half;
                break;

            case 2:
                params.speed = beatkeeper.speeds.quarter;
                break;
        }
    }
});

HC.plugins.shape_rhythm.fullhalfquartereight = _class(false, HC.ShapeRhythmPlugin, {
    name: 'full/half/quarter/eight',
    apply(shape, reverse) {
        var layer = this.layer;
        var params = this.params(shape);
        var mod = shape.index % 4;
        if (reverse) {
            mod = 4 - mod;
        }
        switch (mod) {
            case 0:
                params.speed = beatkeeper.speeds.full;
                break;

            case 1:
                params.speed = beatkeeper.speeds.half;
                break;

            case 2:
                params.speed = beatkeeper.speeds.quarter;
                break;

            case 3:
                params.speed = beatkeeper.speeds.eight;
        }
    }
});

HC.plugins.shape_rhythm.eightquarterhalffull = _class(false, HC.ShapeRhythmPlugin, {
    name: 'eight/quarter/half/full',
    apply(shape) {
        var layer = this.layer;
        var plugin = layer.getShapeRhythmPlugin('fullhalfquartereight');
        plugin.apply(shape, true);
        this.params(shape).speed = plugin.params(shape).speed;
    }
});

