/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.plugins.rotation_mode = HC.plugins.rotation_mode || {};

HC.RotationModePlugin = _class(false, HC.AnimationPlugin, {
    injections: {
        current: {
            x: 0,
            y: 0,
            z: 0
        },
        next: {
            x: 0,
            y: 0,
            z: 0
        },
        tween: false,
        iterations: 0
    },

    isFirstShape: function (shape) {
        return shape.index == -1;
    }
});