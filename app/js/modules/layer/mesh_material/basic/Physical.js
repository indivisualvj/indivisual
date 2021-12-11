/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "../MeshMaterialPlugin";

class physical extends MeshMaterialPlugin {
    static index = 5;

    apply(geometry) {
        this.material = new THREE.MeshPhysicalMaterial();
        return new THREE.Mesh(geometry, this.material);
    }
}

export {physical};
