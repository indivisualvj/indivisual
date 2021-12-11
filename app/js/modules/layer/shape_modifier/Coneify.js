/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeModifierPlugin} from "../ShapeModifierPlugin";
import {Vector3} from "three";

class coneify extends ShapeModifierPlugin {
    static name = 'coneify xyz by y';

    create(geometry, source, axes) {

        source = source || 'y';
        axes = axes || new Vector3(1, 1, 1);

        let vertices = geometry.getAttribute('position');

        if (vertices) {
            this.min = this.max = 0;
            let vtc = new Vector3();
            for (let i = 0; i < vertices.count; i++) {
                vtc.fromBufferAttribute(vertices, i);
                let v = vtc[source];
                this.min = Math.min(v, this.min);
                this.max = Math.max(v, this.max);
            }

            for (let i = 0; i < vertices.count; i++) {
                vtc.fromBufferAttribute(vertices, i);
                let v = vtc[source] * this.settings.shape_modifier_volume;
                let div = Math.abs(this.min - this.max);
                v /= div;

                vertices.setX(i, vtc.x + vtc.x * v * axes.x);
                vertices.setZ(i, vtc.y + vtc.y * v * axes.y);
                vertices.setZ(i, vtc.z + vtc.z * v * axes.z);
            }

            vertices.needsUpdate = true;

        } else {
            console.warn('No transform for ' + geometry.type);
        }

        return geometry
    }
}


class coneifyxzby extends coneify {
    static name = 'coneify xz by y';

    create(shape) {
        return super.create(shape, 'y', new Vector3(1, 0, 1));
    }
}


class coneifyxby extends coneify {
    static name = 'coneify x by y';

    create(shape) {
        return super.create(shape, 'y', new Vector3(1, 0, 0));
    }
}


class coneifyxybz extends coneify {
    static name = 'coneify xy by z';

    create(shape) {
        return super.create(shape, 'z', new Vector3(1, 1, 0));
    }
}

export {coneify, coneifyxby, coneifyxybz, coneifyxzby};

