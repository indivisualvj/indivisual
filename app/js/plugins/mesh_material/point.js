HC.plugins.mesh_material.point = _class(false, HC.MeshMaterialPlugin, {
    index: 2,
    name: 'points (no transform -> edges only)',
    apply: function (geometry, index) {
        var material = new THREE.PointsMaterial();
        // material.lights = true;
        var g = new THREE.EdgesGeometry(geometry);
        var mesh = new THREE.Points(g, material);
        g.userData.geometry = geometry;
        return mesh;
    }
});

HC.plugins.mesh_material.transformablepoints = _class(false, HC.MeshMaterialPlugin, {
    index: 2,
    name: 'points (transform)',
    apply: function (geometry, index) {
        var material = new THREE.PointsMaterial();
        // material.lights = true;
        var mesh = new THREE.Points(geometry, material);
        return mesh;
    }
});
