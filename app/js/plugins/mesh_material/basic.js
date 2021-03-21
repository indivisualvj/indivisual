{
    HC.plugins.mesh_material.basic = class Plugin extends HC.MeshMaterialPlugin {
        static index = 1;

        apply(geometry) {
            let material = garbageman.addMaterial(new THREE.MeshBasicMaterial());
            return new THREE.Mesh(geometry, material);
        }
    }
}
