/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "../MeshMaterialPlugin";

class lambert extends MeshMaterialPlugin {
    static index = 2;

    apply(geometry) {
        this.material = new THREE.MeshLambertMaterial();
        return new THREE.Mesh(geometry, this.material);
    }
}

export {lambert};
