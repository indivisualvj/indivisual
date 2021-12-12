/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeGeometryPlugin} from "../ShapeGeometryPlugin";
import {RoundedBoxGeometry} from "three/examples/jsm/geometries/RoundedBoxGeometry";

class rounded_box extends ShapeGeometryPlugin {
    static name = 'cube (rounded)';
    static tutorial = {
        shape_moda: {
            text: 'set segments'
        },
        shape_modb: {
            text: 'set radius'
        },
    };

    create() {
        let layer = this.layer;

        let size = layer.shapeSize(1);
        // fixme radius depends on resolution?!
        return new RoundedBoxGeometry(size, size, size, this.getModA(1, 2, 32), 4 * this.getModB(0, 0));
    }
}

export {rounded_box};
