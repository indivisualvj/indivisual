{
    HC.plugins.shape_geometry.barbell = class Plugin extends HC.ShapeGeometryPlugin {
        static name = 'barbell';
        static tutorial = {
            shape_moda: {
                text: 'set the initial direction of the shape'
            }
        };

        create() {
            let layer = this.layer;

            let geo = new THREE.BufferGeometry();
            let plane = new THREE.PlaneGeometry(layer.shapeSize(1) * 1.15, layer.shapeSize(1) / 14);

            let pmesh = new THREE.Mesh(plane);
            pmesh.rotation.z = Math.PI / -4;
            pmesh.updateMatrix();
            geo.merge(pmesh.geometry, pmesh.matrix);

            let circ = new THREE.CircleGeometry(layer.shapeSize(.5) / 5, 24, Math.PI, Math.PI * 2);
            let cmesh = new THREE.Mesh(circ);
            cmesh.position.set(layer.shapeSize(.5), -layer.shapeSize(.5), 0);
            cmesh.updateMatrix();
            geo.merge(cmesh.geometry, cmesh.matrix);

            circ = new THREE.CircleGeometry(layer.shapeSize(.5) / 5, 24, Math.PI, Math.PI * 2);
            cmesh = new THREE.Mesh(circ);
            cmesh.position.set(-layer.shapeSize(.5), layer.shapeSize(.5), 0);
            cmesh.updateMatrix();
            geo.merge(cmesh.geometry, cmesh.matrix);

            geo.rotateZ(45 * RAD * this.getModA(0, 0));

            return geo;
        }
    }
}