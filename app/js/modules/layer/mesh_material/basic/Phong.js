/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "../MeshMaterialPlugin";
import {Mesh, MeshPhongMaterial} from "three";

class phong extends MeshMaterialPlugin {
    static index = 3;

    apply(geometry) {
        this.material = new MeshPhongMaterial();
        return new Mesh(geometry, this.material);
    }
}

export {phong};
