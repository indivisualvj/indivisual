HC.plugins.mesh_material.standard = _class(false, HC.MeshMaterialPlugin, {
    index: 1,
    apply(geometry) {
        var material = new THREE.MeshStandardMaterial();
        return new THREE.Mesh(geometry, material);
    }
});
