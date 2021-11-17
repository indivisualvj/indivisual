{
    HC.plugins.mesh_material.physical = class Plugin extends HC.MeshMaterialPlugin {
        static index = 5;

        apply(geometry) {
            this.material = new THREE.MeshPhysicalMaterial();
            return new THREE.Mesh(geometry, this.material);
        }
    }
}
