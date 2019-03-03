{
    HC.plugins.mesh_material.standard = class Plugin extends HC.MeshMaterialPlugin {
        static index = 1;

        apply(geometry) {
            var material = new THREE.MeshStandardMaterial();
            return new THREE.Mesh(geometry, material);
        }
    }
}