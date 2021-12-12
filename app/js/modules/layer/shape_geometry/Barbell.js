/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeGeometryPlugin} from "../ShapeGeometryPlugin";
import {mergeBufferGeometries} from "three/examples/jsm/utils/BufferGeometryUtils";
import {CircleBufferGeometry, PlaneGeometry, Vector2} from "three";

class barbell extends ShapeGeometryPlugin {
    static name = 'barbell';
    static tutorial = {
        shape_moda: {
            text: 'set the initial direction of the shape'
        }
    };

    create() {
        let layer = this.layer;
        let v = new Vector2(layer.shapeSize(1), layer.shapeSize(1));
        let ss = v.length();
        let hss = ss / 2;
        let crad = hss / 5;
        let plane = new PlaneGeometry(ss - 1.86 * crad, ss / 14);
        let circ1 = new CircleBufferGeometry(crad, 24, Math.PI, Math.PI * 2);
        circ1.translate(-hss, 0, 0);
        let circ2 = new CircleBufferGeometry(crad, 24, Math.PI, Math.PI * 2);
        circ2.translate(hss, 0, 0);
        let geo = mergeBufferGeometries([plane, circ1, circ2]);
        geo.rotateZ(45 * RAD + 45 * RAD * this.getModA(0, 0));
        return geo;
    }
}

export {barbell};
