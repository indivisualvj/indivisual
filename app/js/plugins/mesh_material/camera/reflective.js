{
    HC.plugins.mesh_material.reflective = class Plugin extends HC.MeshCameraMaterialPlugin {

        static tutorial = {
            shiny_balls: {
                text: 'set shape_geometry to icosahedron and level of detail (shape_moda) to 3',
                action: function () {
                    let data = {
                        shape: {
                            shape_geometry: 'icosahedron',
                            shape_moda: 3
                        }
                    };
                    this.animation.updateSettings(this.config.ControlSettings.layer, data, true, false, true);
                    messaging.emitSettings(this.config.ControlSettings.layer, data, true, true, true);
                }
            }
        };

        /**
         *
         * @param {THREE.Geometry} geometry
         * @param index
         * @returns {THREE.Mesh}
         */
        apply(geometry, index) {

            geometry.computeBoundingBox();
            let box3 = geometry.boundingBox;
            let height = box3.max.y - box3.min.y;
            let cubeRenderTarget = new THREE.WebGLCubeRenderTarget( height * this.settings.material_volume, {
                format: THREE.RGBFormat,
                generateMipmaps: true,
                minFilter: THREE.LinearMipmapLinearFilter
            } );
            let cubecam = new THREE.CubeCamera(1, 100000, cubeRenderTarget);
            // cubecam.renderTarget = cubeRenderTarget;
            // cubecam.renderTarget.texture.generateMipmaps = true;
            // cubecam.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;

            this.cameras.add(cubecam);

            let material = new THREE.MeshPhysicalMaterial({envMap: cubeRenderTarget.texture});
            let mesh = new THREE.Mesh(geometry, material);
            mesh.name = this.id(index);

            let inst = this;
            this.animation.listener.register(EVENT_RENDERER_RENDER, this.id(index), function (renderer) {
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
}
