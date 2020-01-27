{
    HC.plugins.mesh_material.refractivebackground = class Plugin extends HC.MeshTextureMaterialPlugin {
        static name = 'refractive (cubetexture background)';
        static tutorial = {
            refraction: {
                text: 'use background_input to change refraction'
            },
            refraction_ratio: {
                text: 'use material_shininess to change the material\'s refraction ratio'
            }
        };

        apply(geometry, index) {

            let inst = this;
            let file = this.settings.background_input;
            let material = new THREE.MeshPhysicalMaterial({envMap: null});
            let mesh = new THREE.Mesh(geometry, material);
            mesh.name = this.id(index);

            let _onLoad = function (texture) {
                texture.name = file;
                texture.generateMipmaps = true;
                texture.minFilter = THREE.LinearMipMapLinearFilter;
                texture.mapping = THREE.CubeRefractionMapping;
                material.envMap = texture;
                material.needsUpdate = true;
            };
            this.cubeTextureFromBackgroundInput(_onLoad);

            let id = this.id(index);
            messaging.program.listener.register('animation.updateSetting', id, function (data) {
                if (data.layer === inst.layer) {
                    switch (data.item) {
                        case 'background_input':
                            if (data.value !== file) {
                                file = data.value;
                                inst.cubeTextureFromBackgroundInput(_onLoad);
                            }
                            break;
                    }
                }
            });

            return mesh;
        }

        dispose() {
            messaging.program.listener.removeLike(this.id());
        }
    }
}
