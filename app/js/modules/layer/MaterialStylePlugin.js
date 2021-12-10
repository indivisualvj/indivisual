/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class MaterialStylePlugin extends HC.AnimationPlugin {
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
