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
            if (geometry.computeMorphNormals) {
                geometry.computeMorphNormals();
            }

            geometry.elementsNeedUpdate = true;
            geometry.verticesNeedUpdate = true;
            geometry.uvsNeedUpdate = true;
            geometry.normalsNeedUpdate = true;
            geometry.colorsNeedUpdate = true;

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

        reset() {
            threeTraverse(this);
        }
    }
}
