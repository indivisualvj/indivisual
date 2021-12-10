/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "../MeshMaterialPlugin";

class basic extends MeshMaterialPlugin {
        static index = 1;

        apply(geometry) {
            this.material = new THREE.MeshBasicMaterial();
            return new THREE.Mesh(geometry, this.material);
        }
    }

export {basic};
