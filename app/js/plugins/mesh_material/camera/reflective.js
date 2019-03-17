{
    HC.plugins.mesh_material.reflective = class Plugin extends HC.MeshCameraMaterialPlugin {

        static tutorial = {
            shiny_balls: {
                text: 'set shape_geometry to icosahedron and level of detail (shape_moda) to 3',
                action: function () {
                    let data = {
                        shape_geometry: 'icosahedron',
                        shape_moda: 3
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

    HC.plugins.mesh_material.reflectivebackground = class Plugin extends HC.MeshCameraMaterialPlugin {
        static name = 'reflective (cubetexture background)';
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
                        let texture = plugin.texture; // todo what about the shared principle like in these other plugins
                        texture.generateMipmaps = true;
                        texture.minFilter = THREE.LinearMipMapLinearFilter;
                        texture.mapping = THREE.CubeReflectionMapping;
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