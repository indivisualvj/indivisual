/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeGeometryPlugin} from "../ShapeGeometryPlugin";

class tile extends ShapeGeometryPlugin {
    static index = 10;
    static tutorial = {
        shape_moda: {
            text: 'set corner radius'
        },
        shape_modb: {
            text: 'set number of curve segments'
        },
        shape_modc: {
            text: 'set the initial direction of the shape'
        }
    };

    create() {
        let layer = this.layer;

        let geometry = new HC.RoundedRect(layer.shapeSize(1), this.getModA(1, 1), this.getModB(1, 12)).create();
        HC.GeometryUtils.front2back(geometry);

        geometry.rotateZ(45 * RAD * this.getModC(0, 0));

        return geometry;
    }
}

export {tile};
