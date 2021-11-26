{
    HC.plugins.mesh_material.edges = class Plugin extends HC.MeshMaterialPlugin {
        static index = 10;

        mesh;
        edges;

        apply(geometry) {
            this.material = new THREE.LineBasicMaterial();
            if (!this.edges) {
                this.edges = new THREE.EdgesGeometry(geometry);
            }
            this.mesh = new THREE.LineSegments(this.edges, this.material);

            this.mesh.computeLineDistances();

            return this.mesh;
        }
    }
}
