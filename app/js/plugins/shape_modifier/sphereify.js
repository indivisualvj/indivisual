{
    HC.plugins.shape_modifier.sphereify = class Plugin extends HC.ShapeModifierPlugin {
        static name = 'sphereify';

        create(geometry) {

            let vertices = geometry.vertices;
            geometry.center();

            if (vertices) {

                this.radius = 0;

                for (let i = 0; i < vertices.length; i++) {

                    let vtc = vertices[i];
                    this.radius = Math.max(vtc.length(), this.radius);
                }

                for (let i = 0; i < vertices.length; i++) {

                    let vtc = vertices[i];
                    let l = vtc.length();
                    let m = Math.max(0.001, Math.abs(this.settings.shape_modifier_volume));

                    vtc.multiplyScalar(m);
                    vtc.clampLength(l, this.radius);
                }

                geometry.verticesNeedUpdate = true;

            } else if (!vertices) {
                console.warn('No transform for ' + geometry.type);
            }

            return geometry
        }
    }
}