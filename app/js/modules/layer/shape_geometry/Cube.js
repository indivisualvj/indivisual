/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeGeometryPlugin} from "../ShapeGeometryPlugin";
import {BoxGeometry} from "three";

class cube extends ShapeGeometryPlugin {
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

        return new BoxGeometry(size, size, size, this.getModA(1, 1), this.getModB(1, 1), this.getModC(1, 1));
    }
}

export {cube};
