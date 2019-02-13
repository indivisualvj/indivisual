HC.plugins.rotation_direction = HC.plugins.rotation_direction || {};

HC.RotationDirectionPlugin = _class(false, HC.AnimationPlugin, {
    injections: {
        dir: 0,
        directions: {
            x: 0,
            y: 0,
            z: 0
        }
    },

    isFirstShape: function (shape) {
        return shape.index == -1;
    }
});