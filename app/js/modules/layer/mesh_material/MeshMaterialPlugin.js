/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../../../shared/AnimationPlugin";

class MeshMaterialPlugin extends AnimationPlugin {

    /**
     * @type {THREE.Material}
     */
    material;

    before(geometry) {
        // do nothing until needed

        return geometry;
    }

    reset() {
        HC.traverse(this);
    }
}

export {MeshMaterialPlugin};
