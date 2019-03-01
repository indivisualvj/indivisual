HC.plugins.mesh_material.standard = _class(false, HC.MeshMaterialPlugin, {
    index: 1,
    apply(geometry) {
        var material = new THREE.MeshStandardMaterial();
        var mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }
});
