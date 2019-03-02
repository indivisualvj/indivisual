{
    HC.plugins.material_style.chessline = class Plugin extends HC.MaterialStylePlugin {
        static name = 'chess (fill | line)';
        injections = {
            mesh: false
        };

        apply(shape) {
            let layer = this.layer;
            let pa = this.params(shape);

            if (shape.index % 2 == 1 && !pa.mesh) {
                let mesh = layer.getMeshMaterialPlugin('line').apply(shape.getGeometry());
                pa.mesh = mesh;
                shape.setMesh(mesh);
            }
        }
    }
}
{
    HC.plugins.material_style.randompeakline = class Plugin extends HC.MaterialStylePlugin {
        static name = 'random on peak (line)';
        injections = {
            states: []
        };

        apply(shape) {
            let layer = this.layer;
            let pa = this.params(shape);

            if (!pa.states.length) {
                let mesh = layer.getMeshMaterialPlugin('line').apply(shape.getGeometry());
                pa.states.push(mesh);
                pa.states.push(shape.mesh);
            }

            if ((audio.peak && randomBool())) {
                let state = randomInt(0, 1);
                shape.setMesh(pa.states[state]);
            }
        }
    }
}
