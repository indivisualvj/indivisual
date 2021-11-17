{
    HC.plugins.mesh_material.phong = class Plugin extends HC.MeshMaterialPlugin {
        static index = 3;

        apply(geometry) {
            this.material = new THREE.MeshPhongMaterial();
            return new THREE.Mesh(geometry, this.material);
        }
    }
}
