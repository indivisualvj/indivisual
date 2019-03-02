HC.plugins.mesh_material.phong = _class(false, HC.MeshMaterialPlugin, {
    index: 1,
    apply(geometry) {
        var material = new THREE.MeshPhongMaterial();
        return new THREE.Mesh(geometry, material);
    }
});
