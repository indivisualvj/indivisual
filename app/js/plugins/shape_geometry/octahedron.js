{
    HC.plugins.shape_geometry.octahedron = class Plugin extends HC.ShapeGeometryPlugin {
        static index = 40;
        static tutorial = {
            shape_moda: {
                text: 'set level of detail'
            }
        };
        create() {
            var layer = this.layer;

            var geometry = new THREE.OctahedronGeometry(layer.shapeSize(.5), this.getModA(0, 0, 5));
            return geometry;
        }
    }
}