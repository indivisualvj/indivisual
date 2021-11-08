{
    HC.plugins.material_style.chessedges = class Plugin extends HC.MaterialStylePlugin {
        static name = 'chess (fill | edges)';
        active = [];

        apply(shape) {

            let params = this.params(shape);

            if (shape.index % 2 === 1 && !params.mesh) {
                let mesh = this.layer.getMeshMaterialPlugin('edges').apply(shape.getGeometry());
                mesh.name = 'edges';
                params.mesh = mesh;

                shape.mesh.name = 'original';
                params.original = shape.mesh;

                shape.setMesh(mesh); // question why does transform work when first shape ist not a lined but the others?
            }

            if (!this.active[shape.index]) {
                this.active[shape.index] = true;

                let inst = this;
                this.animation.listener.register('animation.updateSetting', this.id(shape.index), function (data) {
                    if (inst.layer == data.layer) {
                        switch (data.item) {
                            case inst.tree:
                                if (data.value != inst.key && params.original) {
                                    inst.active[shape.index] = false;
                                    params.mesh = false;
                                    shape.setMesh(params.original);

                                    inst.animation.listener.removeId(inst.id(shape.index));
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
                this.animation.listener.removeLike(this.id());
            }
        }
    }
}
{
    HC.plugins.material_style.randompeakedges = class Plugin extends HC.MaterialStylePlugin {
        static name = 'random on peak (edges)';
        active = [];

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);

            if (!params.states) {
                params.states = [];
                params.mesh = shape.mesh;
                let mesh = layer.getMeshMaterialPlugin('edges').apply(shape.getGeometry());
                params.states.push(shape.mesh);
                params.states.push(mesh);
            }

            if ((this.audioAnalyser.peak && randomBool())) {
                let state = randomInt(0, 1);
                shape.setMesh(params.states[state]);
            }

            if (!this.active[shape.index]) {
                this.active[shape.index] = true;

                let inst = this;
                this.animation.listener.register('animation.updateSetting', this.id(shape.index), function (data) {
                    if (inst.layer == data.layer) {
                        switch (data.item) {
                            case inst.tree:
                                if (data.value != inst.key && params.states) {
                                    inst.active[shape.index] = false;
                                    shape.setMesh(params.states[0]);
                                    params.states = false;

                                    inst.animation.listener.removeId(inst.id(shape.index));
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
                this.animation.listener.removeLike(this.id());
            }
        }
    }
}
