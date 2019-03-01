HC.plugins.shape_delay.off = _class(false, HC.ShapeDelayPlugin, {
    index: 1,
    apply(shape) {
        var layer = this.layer;

    }
});

HC.plugins.shape_delay.random = _class(false, HC.ShapeDelayPlugin, {
    name: 'random',
    index: 2,
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        var du = layer.getShapeDuration(shape) * 0.5;
        du = randomInt(0, du);
        params.delay = du;
    }
});

HC.plugins.shape_delay.quarter = _class(false, HC.ShapeDelayPlugin, {
    name: '1/4',
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        if (shape.index % 2 == 1) {
            params.delay = layer.getShapeDuration(shape) / 4;
        }
    }
});

HC.plugins.shape_delay.half = _class(false, HC.ShapeDelayPlugin, {
    name: '1/2',
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        if (shape.index % 2 == 1) {
            params.delay = layer.getShapeDuration(shape) / 2;
        }
    }
});

HC.plugins.shape_delay.grow = _class(false, HC.ShapeDelayPlugin, {
    name: 'grow',
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        var du = layer.getShapeDuration(shape) * 0.5 / layer.shapeCount();
        params.delay = du * shape.index;
    }
});

HC.plugins.shape_delay.shrink = _class(false, HC.ShapeDelayPlugin, {
    name: 'shrink',
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        var du = layer.getShapeDuration(shape) * 0.5 / layer.shapeCount();
        params.delay = du * layer.shapeCount() - du * shape.index;
    }
});

HC.plugins.shape_delay.center = _class(false, HC.ShapeDelayPlugin, {
    name: 'center',
    index: 998,
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        var du = layer.getShapeDuration(shape) * 0.5;
        var ox = Math.abs(layer.patternCenterX() - shape.x()) / layer.patternCenterX();
        params.delay = du * ox;
    }
});

HC.plugins.shape_delay.decenter = _class(false, HC.ShapeDelayPlugin, {
    name: 'decenter',
    index: 999,
    apply(shape) {
        var layer = this.layer;
        var params = this.params(shape);
        var du = layer.getShapeDuration(shape) * 0.5;
        var ox = Math.abs(layer.patternCenterX() - shape.x()) / layer.patternCenterX();
        params.delay = du - du * ox;
    }
});

HC.plugins.shape_delay.chess = _class(
    function () {
        this.switcher = 0;
    },
    HC.ShapeDelayPlugin, {
        name: 'chess',
        before(shape) {
            HC.ShapeDelayPlugin.prototype.before.call(this, shape);
            if (this.isFirstShape(shape)) {
                this.switcher = !this.switcher;
                return false;
            }
        },
        apply(shape) {
            var layer = this.layer;
            var params = this.params(shape);
            if (this.switcher) {
                if (shape.index % 2 == 1) {
                    var rp = layer.getShapeSpeed(shape);
                    params.delay = rp.duration;
                    rp.duration = 0;
                }
            } else {
                if (shape.index % 2 == 0) {
                    var rp = layer.getShapeSpeed(shape);
                    params.delay = rp.duration;
                    rp.duration = 0;
                }
            }
        },
        after(shape) {
            // overwrite super function to disable duration/delay corrections
        }
    }
);