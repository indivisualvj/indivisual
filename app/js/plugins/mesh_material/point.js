{
    HC.plugins.mesh_material.point = class Plugin extends HC.MeshMaterialPlugin {
        static index = 10;
        static name = 'points (edges only -> no transform)';

        apply(geometry, index) {
            let material = new THREE.PointsMaterial();
            let g = new THREE.EdgesGeometry(geometry);
            let mesh = new THREE.Points(g, material);
            g.userData.geometry = geometry;
            return mesh;
        }
    }
}
{
    HC.plugins.mesh_material.transformablepoints = class Plugin extends HC.MeshMaterialPlugin {
        static index = 10;
        static name = 'points (transformable)';

        apply(geometry, index) {
            let material = new THREE.PointsMaterial();
            let mesh = new THREE.Points(geometry, material);
            return mesh;
        }
    }
}