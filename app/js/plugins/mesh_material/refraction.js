{
    HC.plugins.mesh_material.refraction = class Plugin extends HC.MeshMaterialPlugin {
        static index = 90;

        apply(geometry, index) {

            // todo refractionRatio==shinyness?
            var material = new THREE.MeshStandardMaterial({color: 0xffffff, envMap: this.layer.three.scene.background, refractionRatio: 0.95});
            material.envMap.mapping = THREE.CubeRefractionMapping;
            let mesh = new THREE.Mesh(geometry, material);

            let inst = this;
            listener.register('animation.updateSetting', this.id(index), function (data) {
                if (inst.layer.isVisible()) {
                    switch (data.item) {
                        case 'background_mode':
                        case 'background_input':
                            material.envMap = inst.layer.three.scene.background;
                            break;
                    }
                }
            });

            return mesh;
        }

        reset() {

        }
    }
}