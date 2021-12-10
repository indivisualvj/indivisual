/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "../MeshMaterialPlugin";

class standard extends MeshMaterialPlugin {
        static index = 4;

        apply(geometry) {
            this.material = new THREE.MeshStandardMaterial();
            return new THREE.Mesh(geometry, this.material);
        }
    }

export {standard};
