{
    HC.plugins.shape_geometry.dodecahedron = class Plugin extends HC.ShapeGeometryPlugin {
        static index = 40;
        static tutorial = {
            shape_moda: {
                text: 'set level of detail'
            },
        };

        create() {
            let layer = this.layer;

            return new THREE.DodecahedronGeometry(layer.shapeSize(.5), this.getModA(0, 0, 5));
        }
    }
}
