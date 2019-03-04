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

        dispose() {
            listener.removeId(this.id());
        }
    }
}