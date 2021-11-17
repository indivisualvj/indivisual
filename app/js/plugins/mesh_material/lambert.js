{
    HC.plugins.mesh_material.lambert = class Plugin extends HC.MeshMaterialPlugin {
        static index = 2;

        apply(geometry) {
            this.material = new THREE.MeshLambertMaterial();
            return new THREE.Mesh(geometry, this.material);
        }
    }
}
