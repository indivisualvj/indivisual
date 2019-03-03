{
    HC.plugins.mesh_material.phong = class Plugin extends HC.MeshMaterialPlugin {
        static index = 1;

        apply(geometry) {
            var material = new THREE.MeshPhongMaterial();
            return new THREE.Mesh(geometry, material);
        }
    }
}