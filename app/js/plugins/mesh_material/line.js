{
    HC.plugins.mesh_material.line = class Plugin extends HC.MeshMaterialPlugin {
        static index = 2;
        static name = 'line (no transform)';

        apply(geometry) {
            var material = new THREE.LineBasicMaterial();
            // material.lights = true;
            var g = new THREE.EdgesGeometry(geometry);
            var mesh = new THREE.LineSegments(g, material);
            g.userData.geometry = geometry;
            mesh.computeLineDistances();
            return mesh;
        }
    }
}
