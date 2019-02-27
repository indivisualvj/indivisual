{
    HC.plugins.shape_geometry.cube = class Plugin extends HC.ShapeGeometryPlugin {
        static name = 'cube';
        static tutorial = {
            shape_moda: {
                text: 'set width segments'
            },
            shape_modb: {
                text: 'set height segments'
            },
            shape_modc: {
                text: 'set depth segments'
            }
        };

        create() {
            let layer = this.layer;

            let size = layer.shapeSize(1);

            let geometry = new THREE.BoxGeometry(size, size, size, this.getModA(1, 1), this.getModB(1, 1), this.getModC(1, 1));
            return geometry;
        }
    }
}