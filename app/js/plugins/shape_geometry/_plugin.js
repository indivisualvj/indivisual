HC.plugins.shape_geometry = HC.plugins.shape_geometry || {};
{
    HC.ShapeGeometryPlugin = class Plugin extends HC.AnimationPlugin {

        setControlSets(controlSets) {
            super.setControlSets(controlSets);
            // make all such plugins make use of corresponding controlset only
            this.settings = controlSets.shape.properties;
        }

        apply() {
            if (!this.geometry) { // all meshes use the same geometry
                let geometry = this.create();

                if (this.controlSets.material.properties.material_mapping === 'f2b') {
                    HC.UVGenerator.front2back(geometry);
                }

                if (!this.ready()) { // return (fallback) geometry
                    return geometry;
                }

                this.geometry = geometry;
            }

            return this.geometry;
        }

        reset() {
            this.geometry = false;
        }

        create() {
            console.error('HC.ShapeGeometryPlugin: .create() must be implemented in derived plugin.');
        }

        getModA(min, fallback, max) {
            if (this.settings.shape_moda < min) {
                return fallback;
            }
            max = max || this.settings.shape_moda;

            return Math.min(max, this.settings.shape_moda);
        }

        getModB(min, fallback, max) {
            if (this.settings.shape_modb < min) {
                return fallback;
            }

            max = max || this.settings.shape_modb;

            return Math.min(max, this.settings.shape_modb);
        }

        getModC(min, fallback, max) {
            if (this.settings.shape_modc < min) {
                return fallback;
            }

            max = max || this.settings.shape_modc;

            return Math.min(max, this.settings.shape_modc);
        }
    }
}
