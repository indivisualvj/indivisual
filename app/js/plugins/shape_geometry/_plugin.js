HC.plugins.shape_geometry = HC.plugins.shape_geometry || {};
{
    HC.ShapeGeometryPlugin = class Plugin extends HC.AnimationPlugin {

        apply() {
            if (!this.geometry) { // all meshes use the same geometry
                var geometry = this.create();

                if (!geometry._uvsAssigned) {
                    if (this.settings.material_mapping == 'f2b') {
                        this.assignUVs(geometry);
                    }
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

        assignUVs(geometry) {
            assignUVs(geometry)
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