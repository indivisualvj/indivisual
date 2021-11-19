HC.plugins.shape_transform = HC.plugins.shape_transform || {};

{

    HC.ShapeTransformPlugin = class Plugin extends HC.AnimationPlugin { // todo: checkout if everything works when you rename all class Plugin to their final HC. name

        setControlSets(controlSets) {
            super.setControlSets(controlSets);
            // make all such plugins make use of corresponding controlset only
            this.settings = controlSets.shape.properties;
        }

    }
}
