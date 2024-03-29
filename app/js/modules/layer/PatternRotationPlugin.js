/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../AnimationPlugin";
import {Euler, Vector3} from "three";

class PatternRotationPlugin extends AnimationPlugin
{
    euler = new Euler();
    vector = new Vector3();

    setControlSets(controlSets) {
        super.setControlSets(controlSets);
        // make all such plugins make use of corresponding controlset only
        this.settings = controlSets.locking.properties;
    }

    before() {
        let roto = this.layer.shape.rotation();
        let rove = roto.toVector3();
        rove.multiply(this.vector);
        rove.multiplyScalar(this.settings.pattern_rotation_multiplier);
        this.euler.setFromVector3(rove);
    }

    positionIn3dSpace(shape, cp) {
        cp.applyEuler(this.euler);
        cp.add(this.layer.getPatternPlugin().patternCenterVector(true));
        shape.position().copy(cp);
    }
}

export {PatternRotationPlugin};
