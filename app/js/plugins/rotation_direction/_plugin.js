HC.plugins.rotation_direction = HC.plugins.rotation_direction || {};
{
    HC.RotationDirectionPlugin = class Plugin extends HC.AnimationPlugin {
        isFirstShape(shape) {
            return shape.index == -1;
        }
    };

    HC.RotationDirectionPlugin.prototype.injections = {
        dir: 0,
        directions: {
            x: 0,
            y: 0,
            z: 0
        }
    };
}