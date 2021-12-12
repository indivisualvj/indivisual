/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeGeometryPlugin} from "../ShapeGeometryPlugin";
import {PlaneGeometry} from "three";
import {RightTriangle} from "../../../shared/Geometries";

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

        return new PlaneGeometry(
            layer.resolution().x,
            layer.resolution().y,
            this.getModA(1, 1),
            this.getModB(1, 1)
        );
    }
}


class righttriangle extends ShapeGeometryPlugin {
    static name = 'right triangle';

    create() {
        let layer = this.layer;


        return new RightTriangle({width: layer.shapeSize(1), height: layer.shapeSize(1)}).create();
    }
}

export {plane, righttriangle};
