{
    HC.plugins.shape_geometry.cylinder = class Plugin extends HC.ShapeGeometryPlugin {
        static index = 50;
        static tutorial = {
            shape_moda: {
                text: 'set number of circular segments'
            },
            shape_modb: {
                text: 'set number of height segments'
            },
            shape_modc: {
                text: 'set the initial direction of the shape'
            }
        };

        create() {
            let layer = this.layer;

            let size = layer.shapeSize(1);
            let halfSize = layer.shapeSize(.5);
            let geometry = new THREE.CylinderGeometry(halfSize, halfSize, size, this.getModA(3, 16), this.getModB(1, 1), false);
            geometry.rotateX(90 * RAD + this.getModC(0, 0) * 45 * RAD);

            return geometry;
        }
    }
}
{
    HC.plugins.shape_geometry.pipe = class Plugin extends HC.plugins.shape_geometry.cylinder {
        create() {
            let layer = this.layer;

            let size = layer.shapeSize(1);
            let halfSize = layer.shapeSize(.5);
            let geometry = new THREE.CylinderGeometry(halfSize, halfSize, size, this.getModA(3, 16), this.getModB(1, 1), true);
            geometry.rotateX(90 * RAD + this.getModC(0, 0) * 45 * RAD);

            return geometry;
        }
    }
}