HC.plugins.rotation_direction.random = _class(false, HC.RotationDirectionPlugin, {
    index: 1, // place at the start for random
    apply: function (shape) {
        var layer = this.layer;
        var params = this.params(shape);

        var keys = Object.keys(statics.AnimationValues.rotation_direction);
        params.mode = keys[randomInt(1, keys.length - 1)];

        var plugin = layer.getRotationDirectionPlugin(params.mode);
        plugin.apply(shape);

        params.dir = plugin.params(shape).dir;
    }
});

HC.plugins.rotation_direction.left = _class(false, HC.RotationDirectionPlugin, {
    index: 2,
    apply: function (shape) {
        var layer = this.layer;
        this.params(shape).dir = -1;
    }
});

HC.plugins.rotation_direction.right = _class(false, HC.RotationDirectionPlugin, {
    index: 3,
    apply: function (shape) {
        var layer = this.layer;
        this.params(shape).dir = 1;
    }
});

HC.plugins.rotation_direction.leftorright = _class(
    function () {
        this.shared = {
            dir: 0
        };
    },
    HC.RotationDirectionPlugin, {
        name: 'left | right',
        apply: function (shape) {
            if (this.isFirstShape(shape)) {
                this.shared.dir = randomBool() ? -1 : 1;
            }

            this.params(shape).dir = this.shared.dir;
        }
    }
);

HC.plugins.rotation_direction.leftandright = _class(false, HC.RotationDirectionPlugin, {
    name: 'left & right',
    apply: function (shape) {
        var layer = this.layer;
        this.params(shape).dir = (shape.index % 2 == 0) ? -1 : 1;
    }
});

