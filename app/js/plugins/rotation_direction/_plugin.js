HC.plugins.rotation_direction = HC.plugins.rotation_direction || {};
{
    HC.RotationDirectionPlugin = class Plugin extends HC.AnimationPlugin {
        injections = { // todo move into class after all is "classified"
            dir: 0,
            directions: {
                x: 0,
                y: 0,
                z: 0
            }
        };
        switcher = false;

        isFirstShape(shape) {
            return shape.index == -1;
        }
    }
}