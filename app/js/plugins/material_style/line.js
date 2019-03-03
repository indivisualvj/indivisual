{
    HC.plugins.material_style.chessline = class Plugin extends HC.MaterialStylePlugin {
        static name = 'chess (fill | line)';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);

            if (shape.index % 2 == 1 && !params.mesh) {
                let mesh = layer.getMeshMaterialPlugin('line').apply(shape.getGeometry());
                params.mesh = mesh;
                shape.setMesh(mesh); // fixme does not get reset after plugin change. either resetShapes or setMesh after material_style change
            }
        }
    }
}
{
    HC.plugins.material_style.randompeakline = class Plugin extends HC.MaterialStylePlugin {
        static name = 'random on peak (line)';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);

            if (!params.states) {
                params.states = [];
                params.mesh = shape.mesh;
                let mesh = layer.getMeshMaterialPlugin('line').apply(shape.getGeometry());
                params.states.push(shape.mesh);
                params.states.push(mesh);
            }

            if ((audio.peak && randomBool())) {
                let state = randomInt(0, 1);
                shape.setMesh(params.states[state]);
            }
        }
    }
}
