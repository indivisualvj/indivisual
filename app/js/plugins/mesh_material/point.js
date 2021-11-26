{
    HC.plugins.mesh_material.point = class Plugin extends HC.MeshMaterialPlugin {
        static index = 10;
        static name = 'points';

        apply(geometry, index) {
            this.material = new THREE.PointsMaterial();
            return new THREE.Points(geometry, this.material);
        }
    }
}

{
    HC.plugins.mesh_material.pointedges = class Plugin extends HC.MeshMaterialPlugin {
        static index = 10;
        static name = 'points (edges only)';

        mesh;
        edges;

        apply(geometry, index) {
            this.material = new THREE.PointsMaterial();
            if (!this.edges) {
                this.edges = new THREE.EdgesGeometry(geometry);
            }
            this.mesh = new THREE.Points(this.edges, this.material);

            return this.mesh;
        }

        reset() {
            super.reset();
            this.mesh = null;
            this.edges = null;
        }
    }
}
