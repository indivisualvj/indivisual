{
    HC.plugins.mesh_material.edges = class Plugin extends HC.MeshMaterialPlugin {
        static index = 10;
        // static name = 'line (no transform)';

        apply(geometry) {
            let material = materialman.addMaterial(new THREE.LineBasicMaterial());
            let g = new THREE.EdgesGeometry(geometry);
            let mesh = new THREE.LineSegments(g, material);
            g.userData.geometry = geometry;
            mesh.computeLineDistances();

            return mesh;
        }
    }
}
