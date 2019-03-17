{
    HC.plugins.mesh_material.refractive = class Plugin extends HC.MeshCameraMaterialPlugin {

        static tutorial = {
            refraction_ratio: {
                text: 'use material_shininess to change the materials refraction ratio'
            },
            marbles: {
                text: 'set refraction ratio to 50, shape_geometry to icosahedron and level of detail (shape_moda) to 3',
                action: function () {
                    let data = {
                        shape_geometry: 'icosahedron',
                        shape_moda: 3,
                        material_shininess: 50
                    };
                    controller.updateSettings(statics.ControlSettings.layer, data, true, false, true);
                    messaging.emitSettings(statics.ControlSettings.layer, data, true, true, true);
                }
            }
        };

        apply(geometry, index) {

            let cubecam = new THREE.CubeCamera(1, 100000, 256);
            cubecam.renderTarget.texture.generateMipmaps = true;
            cubecam.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
            cubecam.renderTarget.texture.mapping = THREE.CubeRefractionMapping;
            this.cameras.add(cubecam);

            let material = new THREE.MeshStandardMaterial({envMap: cubecam.renderTarget.texture});
            let mesh = new THREE.Mesh(geometry, material);
            mesh.name = this.id(index);

            let inst = this;
            listener.register('renderer.render', this.id(index), function (renderer) {
                if (inst.layer.isVisible()) {
                    mesh.visible = false;

                    mesh.getWorldPosition(cubecam.position);
                    cubecam.update(inst.layer.three.renderer, inst.layer.three.scene);

                    mesh.visible = true;
                }
            });

            return mesh;
        }
    };

    HC.plugins.mesh_material.refractivebackground = class Plugin extends HC.MeshCameraMaterialPlugin {
        static name = 'refractive (cubetexture background)';
        static tutorial = {
            refraction_ratio: {
                text: 'use material_shininess to change the materials refraction ratio'
            }
        };

        apply(geometry, index) {

            // todo change tex on animation.updateSetting

            let material = new THREE.MeshStandardMaterial({envMap: null});
            let mesh = new THREE.Mesh(geometry, material);
            mesh.name = this.id(index);

            let id = this.id(index);
            let inst = this;
            listener.register('renderer.render', id, function (renderer) {
                if (inst.layer.isVisible()) {
                    let plugin = inst.layer.getBackgroundModePlugin();
                    if (plugin.texture && plugin.texture instanceof THREE.CubeTexture) {
                        let texture = plugin.texture;
                        texture.generateMipmaps = true;
                        texture.minFilter = THREE.LinearMipMapLinearFilter;
                        texture.mapping = THREE.CubeRefractionMapping;
                        // texture.needsUpdate = true;
                        material.envMap = texture;
                        material.needsUpdate = true;

                        listener.remove('renderer.render', id);
                    }
                }
            });

            return mesh;
        }

        dispose() {
            listener.removeLike(this.id());
        }
    }
}