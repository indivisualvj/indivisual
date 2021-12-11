/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "../MeshMaterialPlugin";
import {Mesh, MeshBasicMaterial} from "three";

class basic extends MeshMaterialPlugin {
    static index = 1;

    apply(geometry) {
        this.material = new MeshBasicMaterial();
        return new Mesh(geometry, this.material);
    }
}

export {basic};
