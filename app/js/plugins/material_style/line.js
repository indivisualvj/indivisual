HC.plugins.material_style.chessline = _class(false, HC.MaterialStylePlugin, {
        name: 'chess (fill | line)',
        injections: {
            mesh: false,
        },
        apply: function (shape) {
            var layer = this.layer;
            var pa = this.params(shape);

            if (shape.index % 2 == 1 && !pa.mesh) {
                var mesh = layer.getMaterialMeshPlugin('line').apply(shape.getGeometry());
                pa.mesh = mesh;
                shape.setMesh(mesh);
            }
        }
    }
);

HC.plugins.material_style.randompeakline = _class(false, HC.MaterialStylePlugin, {
        name: 'random on peak (line)',
        injections: {
            states: [],
        },
        apply: function (shape) {
            var layer = this.layer;

            var pa = this.params(shape);

            if (!pa.states.length) {
                var mesh = layer.getMaterialMeshPlugin('line').apply(shape.getGeometry());
                pa.states.push(mesh);
                pa.states.push(shape.mesh);
            }

            if ((audio.peak && randomBool())) {
                var state = randomInt(0, 1);
                shape.setMesh(pa.states[state]);
            }
        }
    }
);
