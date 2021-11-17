{
    HC.plugins.mesh_material.basic = class Plugin extends HC.MeshMaterialPlugin {
        static index = 1;

        apply(geometry) {
            this.material = materialman.addMaterial(new THREE.MeshBasicMaterial());
            return new THREE.Mesh(geometry, this.material);
        }
    }
}
