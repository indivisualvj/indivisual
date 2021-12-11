/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "../../shared/AnimationPlugin";

class MaterialStylePlugin extends AnimationPlugin {
    injections = {
        stroke: false
    };

    after(shape) {
        let params = this.params(shape);
        if (params.stroke !== shape.mesh.material.wireframe) {
            shape.mesh.material.wireframe = params.stroke;
        }
    }
}

export {MaterialStylePlugin};
