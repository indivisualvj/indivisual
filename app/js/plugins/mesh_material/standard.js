{
    HC.plugins.mesh_material.standard = class Plugin extends HC.MeshMaterialPlugin {
        static index = 4;

        apply(geometry) {
            let material = materialman.addMaterial(new THREE.MeshStandardMaterial());
            return new THREE.Mesh(geometry, material);
        }
    }
}
