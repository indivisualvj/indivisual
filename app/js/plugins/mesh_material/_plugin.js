HC.plugins.mesh_material = HC.plugins.mesh_material || {};
{
    HC.MeshMaterialPlugin = class Plugin extends HC.AnimationPlugin {

        before(geometry) {

            if (geometry.mergeVertices) {
                geometry.mergeVertices();
            }
            if (geometry.computeFaceNormals) {
                geometry.computeFaceNormals();
            }
            if (geometry.computeFlatVertexNormals) {
                geometry.computeFlatVertexNormals();
            }
            if (geometry.computeVertexNormals) {
                geometry.computeVertexNormals();
            }

            geometry.elementsNeedUpdate = true;
            geometry.verticesNeedUpdate = true;

            let geo;
            if (geometry.isGeometry) {
                geo = new THREE.BufferGeometry().fromGeometry(geometry);

            } else {
                geo = new THREE.BufferGeometry().setFromObject(geometry);
            }

            if (geo) {
                geo.userData.geometry = geometry;
                geometry = geo;
            }

            return geometry;
        }
    }
}
{
    HC.MeshShaderMaterialPlugin = class MeshShaderMaterialPlugin extends HC.MeshMaterialPlugin {
        apply(geometry) {
            let material = new THREE.ShaderMaterial(this.shader);
            material.color = new THREE.Color();

            let inst = this;
            listener.register('renderer.render', this.id(), function (target) {
                material.uniforms.uTime.value = inst.layer.getOscillatePlugin('timestamp').apply({value: 1});
            });

            return new THREE.Mesh(geometry, material);
        }

        dispose() {
            listener.removeId(this.id());
        }
    }
}