/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeGeometryPlugin} from "../ShapeGeometryPlugin";

if (!IS_CONTROLLER) {
    _importThreeGeometry('RoundedBoxGeometry');
}

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

        return new THREE.RoundedBoxGeometry(size, size, size, this.getModA(1, 2, 32), 4 * this.getModB(0, 0));
    }
}

export {rounded_box};
