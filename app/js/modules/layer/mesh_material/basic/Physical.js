/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MeshMaterialPlugin} from "../MeshMaterialPlugin";
import {Mesh, MeshPhysicalMaterial} from "three";

class physical extends MeshMaterialPlugin {
    static index = 5;

    apply(geometry) {
        this.material = new MeshPhysicalMaterial();
        return new Mesh(geometry, this.material);
    }
}

export {physical};
