/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.plugins.rotation_mode = HC.plugins.rotation_mode || {};
{
    HC.RotationModePlugin = class Plugin extends HC.AnimationPlugin {
        isFirstShape(shape) {
            return shape.index == -1;
        }

        injections = {
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
        };

        setControlSets(controlSets) {
            super.setControlSets(controlSets);
            // make all such plugins make use of corresponding controlset only
            this.settings = controlSets.rotation.properties;
        }
    }
}
