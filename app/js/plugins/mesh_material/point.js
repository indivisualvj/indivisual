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

        apply(geometry, index) {
            this.material = new THREE.PointsMaterial();
            let edges = new THREE.EdgesGeometry(geometry);
            let mesh = new THREE.Points(edges, this.material);
            edges.userData.geometry = geometry;

            return mesh;
        }
    }
}
