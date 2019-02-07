HC.plugins.material_mesh.point = _class(false, HC.MaterialMeshPlugin, {
    name: 'points (no transform -> edges only)',
    apply: function (geometry, index) {
        var material = new THREE.PointsMaterial();
        material.sizeAttenuation = false;
        var g = new THREE.EdgesGeometry(geometry);
        var mesh = new THREE.Points(g, material);
        g.userData.geometry = geometry;
        return mesh;
    }
});

HC.plugins.material_mesh.transformablepoints = _class(false, HC.MaterialMeshPlugin, {
    name: 'points (transform)',
    apply: function (geometry, index) {
        var material = new THREE.PointsMaterial();
        material.sizeAttenuation = false;
        var mesh = new THREE.Points(geometry, material);
        return mesh;
    }
});
