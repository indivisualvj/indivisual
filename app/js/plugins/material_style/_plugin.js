HC.plugins.material_style = HC.plugins.material_style || {};

HC.MaterialStylePlugin = _class(false, HC.AnimationPlugin, {
    injections: {
        stroke: false
    },
    after: function (shape) {
        var params = this.params(shape);
        if (params.stroke != shape.mesh.material.wireframe) {
            shape.mesh.material.wireframe = params.stroke;
            shape.mesh.material.needsUpdate = true;
        }
    }
});