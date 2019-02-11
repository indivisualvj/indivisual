HC.plugins.mesh_material = HC.plugins.mesh_material || {};

HC.MeshMaterialPlugin = _class(false, HC.Plugin, {
    before: function (geometry) {

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

        var geo;
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
    },

    after: function (mesh) {
        var m = mesh.material;
        // m.dithering = true;
        m.shadowSide = THREE.BackSide;
        // m.needsUpdate = true;
    }
});