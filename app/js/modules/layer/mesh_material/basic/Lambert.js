/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "../MeshMaterialPlugin";
import {Mesh, MeshLambertMaterial} from "three";

class lambert extends MeshMaterialPlugin {
    static index = 2;

    apply(geometry) {
        this.material = new MeshLambertMaterial();
        return new Mesh(geometry, this.material);
    }
}

export {lambert};
