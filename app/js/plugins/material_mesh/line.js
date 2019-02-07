HC.plugins.material_mesh.line = _class(false, HC.MaterialMeshPlugin, {
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
