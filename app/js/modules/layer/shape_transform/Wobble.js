/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ShapeTransformPlugin} from "../ShapeTransformPlugin";
import {Oscillators} from "../../../shared/Oscillators";
import {Vector3} from "three";

class wobble extends ShapeTransformPlugin {
    static name = 'wobble xyz';

    angle;
    rumble = {
        x: 0,
        y: 0,
        z: 0
    }

    apply(shape, axes) {
        axes = axes || new Vector3(1, 1, 1);

        if (!this.angle) {
            this.angle = 360;

            this.osci = {
                osci1_period: .125,
                osci1_amp: 4,
                osci2_period: .066783782,
                osci2_amp: 1,
                osci3_period: .022342,
                osci3_amp: 2,
                rhythm: 'half',
                tempo: this.config.ControlSettings.tempo,
            };
        }

        this.osci.rhythm = this.controlSets.audio.get('rhythm');

        let multiplier = this.settings.shape_transform_volume * 15;
        let vertices = shape.geometry.getAttribute('position');
        let vbackup = this.vertices;

        let vtc = new Vector3();
        for (let i = 0; i < vertices.count; i++) {

            vtc.fromBufferAttribute(vertices, i);
            let vtcb = vbackup[i];
            if (!vtcb._rumble) {
                vtcb._rumble = {
                    x: randomFloat(0, Math.PI, 2, true),
                    y: randomFloat(0, Math.PI, 2, true),
                    z: randomFloat(0, Math.PI, 2, true)
                };
            }

            vtcb._rumble.x += this.animation.diffPrc * randomFloat(0, .25 * Math.PI, 2, true);
            vtcb._rumble.y += this.animation.diffPrc * randomFloat(0, .25 * Math.PI, 2, true);
            vtcb._rumble.z += this.animation.diffPrc * randomFloat(0, .25 * Math.PI, 2, true);

            let w1 = multiplier * Oscillators.wobble(this.beatKeeper, vtcb._rumble.x, this.osci);
            let w2 = multiplier * Oscillators.wobble(this.beatKeeper, vtcb._rumble.y, this.osci);
            let w3 = multiplier * Oscillators.wobble(this.beatKeeper, vtcb._rumble.z, this.osci);

            vertices.setXYZ(i,
                vtcb.x + w1 * axes.x,
                vtcb.y + w2 * axes.y,
                vtcb.z + w3 * axes.z
            );
        }
    }
}


class wobblex extends wobble {
    static name = 'wobble x';

    apply(shape) {
        super.apply(shape, new Vector3(1, 0, 0));
    }
}


class wobbley extends wobble {
    static name = 'wobble y';

    apply(shape) {
        super.apply(shape, new Vector3(0, 1, 0));
    }
}


class wobblez extends wobble {
    static name = 'wobble z';

    apply(shape) {
        super.apply(shape, new Vector3(0, 0, 1));
    }
}

export {wobble, wobblex, wobbley, wobblez};
