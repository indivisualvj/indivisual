HC.plugins.mesh_material.lambert = _class(false, HC.MeshMaterialPlugin, {
    index: 1,
    apply(geometry) {
        var material = new THREE.MeshLambertMaterial();
        return new THREE.Mesh(geometry, material);
    }
});
