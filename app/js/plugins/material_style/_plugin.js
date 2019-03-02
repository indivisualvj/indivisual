HC.plugins.material_style = HC.plugins.material_style || {};
{
    HC.MaterialStylePlugin = class Plugin extends HC.AnimationPlugin {
        injections = {
            stroke: false
        };

        after(shape) {
            let params = this.params(shape);
            if (params.stroke != shape.mesh.material.wireframe) {
                shape.mesh.material.wireframe = params.stroke;
                shape.mesh.material.needsUpdate = true;
            }
        }
    };
}