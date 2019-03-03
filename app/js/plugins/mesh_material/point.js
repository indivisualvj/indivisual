{
    HC.plugins.mesh_material.point = class Plugin extends HC.MeshMaterialPlugin {
        static index = 2;
        static name = 'points (no transform -> edges only)';

        apply(geometry, index) {
            let material = new THREE.PointsMaterial();
            // material.lights = true;
            let g = new THREE.EdgesGeometry(geometry);
            let mesh = new THREE.Points(g, material);
            g.userData.geometry = geometry;
            return mesh;
        }
    }
}
{
    HC.plugins.mesh_material.transformablepoints = class Plugin extends HC.MeshMaterialPlugin {
        static index = 2;
        static name = 'points (transform)';

        apply(geometry, index) {
            let material = new THREE.PointsMaterial();
            // material.lights = true;
            let mesh = new THREE.Points(geometry, material);
            return mesh;
        }
    }
}