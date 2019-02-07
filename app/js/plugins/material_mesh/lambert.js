HC.plugins.material_mesh.lambert = _class(false, HC.MaterialMeshPlugin, {
    index: 1,
    apply: function (geometry) {
        var material = new THREE.MeshLambertMaterial();
        var mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }
});
