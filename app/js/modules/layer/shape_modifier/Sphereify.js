/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeModifierPlugin} from "../ShapeModifierPlugin";
import {Vector3} from "three";

class sphereify extends ShapeModifierPlugin {
    static name = 'sphereify';

    create(geometry) {

        geometry.center();
        let vertices = geometry.getAttribute('position');

        if (vertices) {

            this.radius = 0;

            let vtc = new Vector3();
            for (let i = 0; i < vertices.count; i++) {
                vtc.fromBufferAttribute(vertices, i);
                this.radius = Math.max(vtc.length(), this.radius);
            }

            for (let i = 0; i < vertices.count; i++) {

                vtc.fromBufferAttribute(vertices, i);
                let l = vtc.length();
                let m = Math.max(0.001, Math.abs(this.settings.shape_modifier_volume));

                vtc.multiplyScalar(m);
                vtc.clampLength(l, this.radius);

                vertices.setXYZ(i, vtc.x, vtc.y, vtc.z);
            }

            vertices.needsUpdate = true;

        } else {
            console.warn('No transform for ' + geometry.type);
        }

        return geometry
    }
}

export {sphereify};

