/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternRotationPlugin} from "../PatternRotationPlugin";
import {Vector3} from "three";

class all extends PatternRotationPlugin {
    vector = new Vector3(1, 1, 1);

    apply() {
    }
}


class xaxis extends PatternRotationPlugin {
    vector = new Vector3(1, 0, 0);

    apply() {
    }
}


class yaxis extends PatternRotationPlugin {
    vector = new Vector3(0, 1, 0);

    apply() {
    }
}


class zaxis extends PatternRotationPlugin {
    vector = new Vector3(0, 0, 1);

    apply() {
    }
}

export {all, yaxis, xaxis, zaxis};
