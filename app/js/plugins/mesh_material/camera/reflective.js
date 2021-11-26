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
         * @param {THREE.BufferGeometry} geometry
         * @param index
         * @returns {THREE.Mesh}
         */
        apply(geometry, index) {

            geometry.computeBoundingBox();

            let box3 = geometry.boundingBox;
            let height = box3.max.y - box3.min.y;
            let cubeRenderTarget = new THREE.WebGLCubeRenderTarget( height, {
                format: THREE.RGBFormat,
                generateMipmaps: true,
                minFilter: THREE.LinearMipmapLinearFilter
            } );
            let cubecam = new THREE.CubeCamera(1, 10000, cubeRenderTarget);

            this.cameras.add(cubecam);

            this.material = new THREE.MeshPhongMaterial({
                envMap: cubeRenderTarget.texture
            });
            let mesh = new THREE.Mesh(geometry, this.material);
            mesh.name = this.id(index);

            HC.EventManager.getInstance().register(EVENT_RENDERER_BEFORE_RENDER, this.id(index), (renderer) => {
                if (this.layer.isVisible()) {
                    mesh.visible = false;

                    mesh.getWorldPosition(cubecam.position);
                    cubecam.update(this.layer.three.renderer, this.layer.three.scene);

                    mesh.visible = true;
                }
            });

            return mesh;
        }
    };
}
