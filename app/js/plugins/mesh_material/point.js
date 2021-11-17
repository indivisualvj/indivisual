{
    HC.plugins.mesh_material.point = class Plugin extends HC.MeshMaterialPlugin {
        static index = 10;
        static name = 'points';

        apply(geometry, index) {
            this.material = materialman.addMaterial(new THREE.PointsMaterial());
            return new THREE.Mesh(geometry, this.material);
        }
    }
}
{
    HC.plugins.mesh_material.pointedges = class Plugin extends HC.MeshMaterialPlugin {
        static index = 10;
        static name = 'points (edges only)';

        apply(geometry, index) {
            this.material = materialman.addMaterial(new THREE.PointsMaterial());
            let g = new THREE.EdgesGeometry(geometry);
            let mesh = new THREE.Points(g, material);
            g.userData.geometry = geometry;

            return mesh;
        }
    }
}
