HC.plugins.mesh_material.phong = _class(false, HC.MeshMaterialPlugin, {
    index: 1,
    apply: function (geometry) {
        var material = new THREE.MeshPhongMaterial();
        var mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }
});
