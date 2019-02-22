HC.plugins.shape_modifier = HC.plugins.shape_modifier || {};
{
    HC.ShapeModifierPlugin = class Plugin extends HC.AnimationPlugin {

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

        assignUVs(geometry) {
            assignUVs(geometry);
        }
    }
}