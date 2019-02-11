HC.plugins.mesh_material.line = _class(false, HC.MeshMaterialPlugin, {
    name: 'line (no transform)',
    apply: function (geometry) {
        var material = new THREE.LineBasicMaterial();
        // material.lights = true;
        var g = new THREE.EdgesGeometry(geometry);
        var mesh = new THREE.LineSegments(g, material);
        g.userData.geometry = geometry;
        mesh.computeLineDistances();
        return mesh;
    }
});
