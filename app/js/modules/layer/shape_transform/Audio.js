/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeTransformPlugin} from "../ShapeTransformPlugin";

class audio extends ShapeTransformPlugin {
    static name = 'audio xyz';

    vertices;

    apply(shape, axis) {
        let vertices = shape.geometry.getAttribute('position');
        let vbackup = this.vertices;

        let ai = 0;
        for (let i = 0; i < vertices.count; i++) {

            let x = 1, y = 1, z = 1;

            let v = this.settings.shape_sync ? this.audioAnalyser.volume : this.audioAnalyser.getVolume(ai++);

            v *= this.settings.shape_transform_volume;

            if (this.settings.shape_limit) {
                v += 1.0;
            }

            if (axis) {
                switch (axis) {
                    case 'x':
                        x *= v;
                        break;
                    case 'y':
                        y *= v;
                        break;
                    case 'z':
                        z *= v;
                        break;
                    case 'xy':
                        x *= v;
                        y *= v;
                        break;
                }
            } else {
                x *= v;
                y *= v;
                z *= v;
            }

            let vtcb = vbackup[i];
            vertices.setX(i, vtcb.x ? vtcb.x * x : x * x * x);
            vertices.setY(i, vtcb.y ? vtcb.y * y : y * y * y);
            vertices.setZ(i, vtcb.z ? vtcb.z * z : z * z * z);
        }
    }
}


class audiox extends audio {
    static name = 'audio x';

    apply(shape) {
        super.apply(shape, 'x');
    }
}


class audioy extends audio {
    static name = 'audio y';

    apply(shape) {
        super.apply(shape, 'y');
    }
}


class audioz extends audio {
    static name = 'audio z';

    apply(shape) {
        super.apply(shape, 'z');
    }
}


class audioxy extends audio {
    static name = 'audio xy';

    apply(shape) {
        super.apply(shape, 'xy');
    }
}

export {audio, audioxy, audioy, audioz, audiox};
