{
    HC.plugins.rotation_direction.random = class Plugin extends HC.RotationDirectionPlugin {
        static index = 1;

        // place at the start for random
        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);

            let keys = Object.keys(statics.AnimationValues.rotation_direction);
            params.mode = keys[randomInt(1, keys.length - 1)];

            let plugin = layer.getRotationDirectionPlugin(params.mode);
            plugin.apply(shape);

            params.dir = plugin.params(shape).dir;
        }
    }
}
{
    HC.plugins.rotation_direction.left = class Plugin extends HC.RotationDirectionPlugin {
        static index = 2;

        apply(shape) {
            this.params(shape).dir = -1;
        }
    }
}
{
    HC.plugins.rotation_direction.right = class Plugin extends HC.RotationDirectionPlugin {
        static index = 3;

        apply(shape) {
            this.params(shape).dir = 1;
        }
    }
}
{
    HC.plugins.rotation_direction.leftorright = class Plugin extends HC.RotationDirectionPlugin {
        static name = 'left | right';
        shared = {
            dir: 0
        };

        apply(shape) {
            if (this.isFirstShape(shape)) {
                this.shared.dir = randomBool() ? -1 : 1;
            }

            this.params(shape).dir = this.shared.dir;
        }
    }
}
{
    HC.plugins.rotation_direction.leftandright = class Plugin extends HC.RotationDirectionPlugin {
        static name = 'left & right';

        apply(shape) {
            this.params(shape).dir = (shape.index % 2 == 0) ? -1 : 1;
        }
    }
}