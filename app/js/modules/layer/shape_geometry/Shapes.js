/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeGeometryPlugin} from "../ShapeGeometryPlugin";

class plane extends ShapeGeometryPlugin {
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


    class righttriangle extends ShapeGeometryPlugin {
        static name = 'right triangle';

        create() {
            let layer = this.layer;


            return new HC.RightTriangle({width: layer.shapeSize(1), height: layer.shapeSize(1)}).create();
        }
    }

export {plane, righttriangle};
