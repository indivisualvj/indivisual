{
    HC.plugins.material_style.chessline = class Plugin extends HC.MaterialStylePlugin {
        static name = 'chess (fill | line)';
        active = [];

        apply(shape) {

            let params = this.params(shape);

            if (shape.index % 2 == 1 && !params.mesh) {
                let mesh = this.layer.getMeshMaterialPlugin('line').apply(shape.getGeometry());
                mesh.name = 'line';
                params.mesh = mesh;

                shape.mesh.name = 'original';
                params.original = shape.mesh;

                shape.setMesh(mesh); // todo why does it work when first shape ist not a lined but the others?
            }

            if (!this.active[shape.index]) {
                this.active[shape.index] = true;

                let inst = this;
                listener.register('animation.updateSetting', this.id(shape.index), function (data) {
                    if (inst.layer == data.layer) {
                        switch (data.item) {
                            case inst.tree:
                                if (data.value != inst.key && params.original) {
                                    inst.active[shape.index] = false;
                                    params.mesh = false;
                                    shape.setMesh(params.original);

                                    listener.removeId(inst.id(shape.index));
                                }
                                break;
                        }
                    }
                });
            }
        }

        reset() {
            if (this.active.length) {
                this.active = [];
                listener.removeLike(this.id());
            }
        }
    }
}
{
    HC.plugins.material_style.randompeakline = class Plugin extends HC.MaterialStylePlugin {
        static name = 'random on peak (line)';
        active = [];

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

            if (!this.active[shape.index]) {
                this.active[shape.index] = true;

                let inst = this;
                listener.register('animation.updateSetting', this.id(shape.index), function (data) {
                    if (inst.layer == data.layer) {
                        switch (data.item) {
                            case inst.tree:
                                if (data.value != inst.key && params.states) {
                                    inst.active[shape.index] = false;
                                    shape.setMesh(params.states[0]);
                                    params.states = false;

                                    listener.removeId(inst.id(shape.index));
                                }
                                break;
                        }
                    }
                });
            }
        }

        reset() {
            if (this.active.length) {
                this.active = [];
                listener.removeLike(this.id());
            }
        }
    }
}
