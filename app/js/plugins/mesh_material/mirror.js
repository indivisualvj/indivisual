{
    HC.plugins.mesh_material.mirror = class Plugin extends HC.MeshMaterialPlugin {
        static index = 90;
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
        cameras;

        apply(geometry, index) {

            if (!this.cameras) {
                this.cameras = new THREE.Group();
                this.cameras.name = this.id('cameras');
                this.layer.three.scene.add(this.cameras);
                this.cameras.position.copy(this.layer._rotation.position);
            }

            let counter = 0;

            let camera1 = new THREE.CubeCamera(1, 100000, 256);
            camera1.renderTarget.texture.generateMipmaps = true;
            camera1.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
            this.cameras.add(camera1);

            let camera2 = new THREE.CubeCamera(1, 100000, 256);
            camera2.renderTarget.texture.generateMipmaps = true;
            camera2.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
            this.cameras.add(camera2);

            let material = new THREE.MeshStandardMaterial({envMap: camera1.renderTarget.texture});
            let mesh = new THREE.Mesh(geometry, material);
            mesh.name = this.id(index);

            let inst = this;
            listener.register('renderer.render', this.id(index), function (renderer) {

                if (inst.layer.isVisible()) {
                    mesh.visible = false;

                    if (counter % 2) {
                        material.envMap = camera2.renderTarget.texture;
                        mesh.getWorldPosition(camera1.position);
                        camera1.update(renderer.three.renderer, renderer.three.scene);

                    } else {
                        material.envMap = camera1.renderTarget.texture;
                        mesh.getWorldPosition(camera2.position);
                        camera2.update(renderer.three.renderer, renderer.three.scene);
                    }

                    mesh.visible = true;

                    counter++;
                }
            });

            return mesh;
        }

        reset() {
            if (this.cameras) {
                this.layer.three.scene.remove(this.cameras);
                this.cameras = undefined;

                listener.removeLike(this.id());
            }
        }
    }
}