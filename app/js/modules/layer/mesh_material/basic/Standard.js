/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "../MeshMaterialPlugin";
import {Mesh, MeshStandardMaterial} from "three";

class standard extends MeshMaterialPlugin {
    static index = 4;

    apply(geometry) {
        this.material = new MeshStandardMaterial();
        return new Mesh(geometry, this.material);
    }
}

export {standard};
