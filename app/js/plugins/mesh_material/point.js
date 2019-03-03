{
    HC.plugins.mesh_material.point = class Plugin extends HC.MeshMaterialPlugin {
        static index = 2;
        static name = 'points (no transform -> edges only)';

        apply(geometry, index) {
            var material = new THREE.PointsMaterial();
            // material.lights = true;
            var g = new THREE.EdgesGeometry(geometry);
            var mesh = new THREE.Points(g, material);
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
            var material = new THREE.PointsMaterial();
            // material.lights = true;
            var mesh = new THREE.Points(geometry, material);
            return mesh;
        }
    }
}