HC.plugins.mesh_material.line = _class(false, HC.MeshMaterialPlugin, {
    name: 'line (no transform)',
    apply: function (geometry) {
        var material = new THREE.LineBasicMaterial();
        var g = new THREE.EdgesGeometry(geometry);
        var mesh = new THREE.LineSegments(g, material);
        g.userData.geometry = geometry;
        mesh.computeLineDistances();
        return mesh;
    }
});
