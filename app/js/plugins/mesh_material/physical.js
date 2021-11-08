{
    HC.plugins.mesh_material.physical = class Plugin extends HC.MeshMaterialPlugin {
        static index = 5;

        apply(geometry) {
            let material = materialman.addMaterial(new THREE.MeshPhysicalMaterial());
            return new THREE.Mesh(geometry, material);
        }
    }
}
