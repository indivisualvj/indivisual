/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeGeometryPlugin} from "../ShapeGeometryPlugin";
import {TetrahedronGeometry} from "three";

class tetrahedron extends ShapeGeometryPlugin {
    static index = 40;
    static tutorial = {
        shape_moda: {
            text: 'set level of detail'
        }
    };

    create() {
        let layer = this.layer;

        return new TetrahedronGeometry(layer.shapeSize(.5), this.getModA(0, 0, 5));
    }
}

export {tetrahedron};
