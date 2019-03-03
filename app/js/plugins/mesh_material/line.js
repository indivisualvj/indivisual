{
    HC.plugins.mesh_material.line = class Plugin extends HC.MeshMaterialPlugin {
        static index = 2;
        static name = 'line (no transform)';

        apply(geometry) {
            let material = new THREE.LineBasicMaterial();
            // material.lights = true;
            let g = new THREE.EdgesGeometry(geometry);
            let mesh = new THREE.LineSegments(g, material);
            g.userData.geometry = geometry;
            mesh.computeLineDistances();
            return mesh;
        }
    }
}
