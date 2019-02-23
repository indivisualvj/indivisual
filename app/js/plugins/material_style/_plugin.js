HC.plugins.material_style = HC.plugins.material_style || {};
{
    HC.MaterialStylePlugin = class Plugin extends HC.AnimationPlugin {

        after(shape) {
            var params = this.params(shape);
            if (params.stroke != shape.mesh.material.wireframe) {
                shape.mesh.material.wireframe = params.stroke;
                shape.mesh.material.needsUpdate = true;
            }
        }
    };

    HC.MaterialStylePlugin.prototype.injections = {
        stroke: false
    };
}