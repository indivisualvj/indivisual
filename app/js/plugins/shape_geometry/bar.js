{
    HC.plugins.shape_geometry.bar = class Plugin extends HC.ShapeGeometryPlugin {
        static tutorial = {
            shape_moda: {
                text: 'set the initial direction of the shape'
            }
        };

        create() {
            let layer = this.layer;
            let geometry = new THREE.PlaneGeometry(layer.shapeSize(1), layer.shapeSize(.1));
            geometry.rotateZ(45 * RAD * this.getModA(0, 0));

            return geometry;
        }
    }
}