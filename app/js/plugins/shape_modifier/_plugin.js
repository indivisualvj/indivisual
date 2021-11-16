HC.plugins.shape_modifier = HC.plugins.shape_modifier || {};
{
    // todo: either create shape to work like display borders, or try a modifier to achieve it.

    HC.ShapeModifierPlugin = class Plugin extends HC.AnimationPlugin {

        setControlSets(controlSets) {
            super.setControlSets(controlSets);
            // make all such plugins make use of corresponding controlset only
            this.settings = controlSets.shape.properties;
        }

        apply(geometry) {
            if (!this.geometry) { // all meshes use the same geometry
                geometry = this.create(geometry);

                this.geometry = geometry;
            }

            return this.geometry;
        }

        reset() {
            this.geometry = false;
        }

        create(geometry) {
            console.error('HC.ShapeModifierPlugin: .create() must be implemented in derived plugin.');
        }
    }
}
