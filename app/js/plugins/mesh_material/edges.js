{
    HC.plugins.mesh_material.edges = class Plugin extends HC.MeshMaterialPlugin {
        static index = 10;
        // static name = 'line (no transform)';

        apply(geometry) {
            let material = new THREE.LineBasicMaterial();
            this.material = material;
            let edges = new THREE.EdgesGeometry(geometry);
            this.geometry = edges;
            let mesh = new THREE.LineSegments(edges, material);
            this.mesh = mesh;
            edges.userData.geometry = geometry;
            mesh.computeLineDistances();

            return mesh;
        }
    }
}
