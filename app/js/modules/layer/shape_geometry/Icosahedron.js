/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeGeometryPlugin} from "../ShapeGeometryPlugin";
import {IcosahedronGeometry} from "three";

class icosahedron extends ShapeGeometryPlugin {
    static index = 40;
    static tutorial = {
        shape_moda: {
            text: 'set level of detail'
        },
        sphere: {
            text: 'to create a sphere set the level of detail to 3',
            action: function () {
                this.animation.updateSetting(this.config.ControlSettings.layer, {shape: {shape_moda: 3}}, true, true, false);
            }
        }
    };

    create() {
        let layer = this.layer;

        return new IcosahedronGeometry(layer.shapeSize(.5), this.getModA(0, 0, 5));
    }
}

export {icosahedron};
