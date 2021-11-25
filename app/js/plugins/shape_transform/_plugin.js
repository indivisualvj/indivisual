HC.plugins.shape_transform = HC.plugins.shape_transform || {};
{
    HC.ShapeTransformPlugin = class Plugin extends HC.AnimationPlugin {

        injections = {
            vertices: null
        };

        setControlSets(controlSets) {
            super.setControlSets(controlSets);
            // make all such plugins make use of corresponding controlset only
            this.settings = controlSets.shape.properties;
        }

    }
}
