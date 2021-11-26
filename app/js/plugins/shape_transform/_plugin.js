HC.plugins.shape_transform = HC.plugins.shape_transform || {};
{
    HC.ShapeTransformPlugin = class Plugin extends HC.AnimationPlugin {

        vertices;

        before(shape) {
            if (!this.vertices) {
                let vertices = shape.geometry.getAttribute('position');
                this.vertices = [];
                let v = new THREE.Vector3();
                for (let i = 0; i < vertices.count; i++) {
                    v.fromBufferAttribute(vertices, i);
                    this.vertices.push(v.clone());
                }
            }

            return this.isFirstShape(shape);
        }

        after(shape) {
            if (this.key !== 'off') {
                if (shape.geometry.attributes.lineDistance) {
                    shape.geometry.attributes.lineDistance.needsUpdate = true;
                }
                shape.geometry.attributes.position.needsUpdate = true;
            }
        }

        setControlSets(controlSets) {
            super.setControlSets(controlSets);
            // make all those plugins make use of corresponding controlset only
            this.settings = controlSets.shape.properties;
        }

        reset() {
            this.vertices = null;
        }
    }
}
