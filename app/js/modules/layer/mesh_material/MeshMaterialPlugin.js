/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../../AnimationPlugin";
import * as HC from '../../../shared/Three';

class MeshMaterialPlugin extends AnimationPlugin {

    /**
     * @type {Material}
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
