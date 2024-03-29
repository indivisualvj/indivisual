/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeGeometryPlugin} from "../ShapeGeometryPlugin";
import {RoundedRect} from "../../../shared/Geometries";
import {GeometryUtils} from "../../../shared/GeometryUtils";

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

        let geometry = new RoundedRect(layer.shapeSize(1), this.getModA(1, 1), this.getModB(1, 12)).create();
        GeometryUtils.front2back(geometry);

        geometry.rotateZ(45 * RAD * this.getModC(0, 0));

        return geometry;
    }
}

export {tile};
