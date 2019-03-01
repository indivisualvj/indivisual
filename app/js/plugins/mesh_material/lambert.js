HC.plugins.mesh_material.lambert = _class(false, HC.MeshMaterialPlugin, {
    index: 1,
    apply(geometry) {
        var material = new THREE.MeshLambertMaterial();
        var mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }
});
