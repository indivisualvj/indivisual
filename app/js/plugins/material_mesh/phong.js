HC.plugins.material_mesh.phong = _class(false, HC.MaterialMeshPlugin, {
    index: 2,
    apply: function (geometry) {
        var material = new THREE.MeshPhongMaterial();
        var mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }
});
