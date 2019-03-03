{
    HC.plugins.shape_geometry.plane = class Plugin extends HC.ShapeGeometryPlugin {
        static tutorial = {
            size: {
                text: 'This shape by default is as large as resolution. Reduce pattern_shapes to 1 first.'
            },
            shape_modb: {
                text: 'set width segments'
            },
            shape_modc: {
                text: 'set height segments'
            }
        };
        create() {
            let layer = this.layer;

            let geometry = new THREE.PlaneGeometry(
                layer.resolution().x,
                layer.resolution().y,
                this.getModA(1, 1),
                this.getModB(1, 1)
            );
            return geometry;
        }
    }
}
{
    HC.plugins.shape_geometry.righttriangle = class Plugin extends HC.ShapeGeometryPlugin {
        static name = 'right triangle';

        create() {
            let layer = this.layer;


            let geometry = new HC.RightTriangle({width: layer.shapeSize(1), height: layer.shapeSize(1)}).create();

            return geometry;
        }
    }
}