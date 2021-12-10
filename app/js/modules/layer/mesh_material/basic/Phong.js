/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "../MeshMaterialPlugin";

class phong extends MeshMaterialPlugin {
        static index = 3;

        apply(geometry) {
            this.material = new THREE.MeshPhongMaterial();
            return new THREE.Mesh(geometry, this.material);
        }
    }

export {phong};
