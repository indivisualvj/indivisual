{
    HC.plugins.mesh_material.camera = class Plugin extends HC.MeshMaterialPlugin {
        static index = 2;
        camera1;
        camera2;
        counter = 0;
        index = 0;

        apply(geometry, index) {
            this.index = index;
            this.camera1 = new THREE.CubeCamera(1, 100000, 256);
            this.camera1.renderTarget.texture.generateMipmaps = true;
            this.camera1.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
            renderer.three.scene.add(this.camera1);

            this.camera2 = new THREE.CubeCamera(1, 100000, 256);
            this.camera2.renderTarget.texture.generateMipmaps = true;
            this.camera2.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
            renderer.three.scene.add(this.camera2);

            let material = new THREE.MeshBasicMaterial({envMap: this.camera1.renderTarget.texture});
            let mesh = new THREE.Mesh(geometry, material);

            let inst = this;
            listener.register('renderer.render', this.id(index), function (renderer) {

                mesh.visible = false;

                if (inst.counter % 2) {
                    material.envMap = inst.camera2.renderTarget.texture;

                    mesh.matrixWorld.decompose(inst.camera1.position, inst.camera1.quaternion, new THREE.Vector3());

                    // inst.camera1.position.copy(mesh.position);
                    // inst.camera1.quaternion.copy(quaternion);
                    inst.camera1.update(renderer.three.renderer, renderer.three.scene);

                } else {
                    material.envMap = inst.camera1.renderTarget.texture;
                    mesh.matrixWorld.decompose(inst.camera2.position, inst.camera2.quaternion, new THREE.Vector3());
                    // inst.camera2.position.copy(mesh.position);
                    // inst.camera2.quaternion.copy( quaternion );
                    inst.camera2.update(renderer.three.renderer, renderer.three.scene);
                }

                mesh.visible = true;

                inst.counter++;
            });

            return mesh;
        }

        dispose() {

            listener.removeId(this.id(this.index));

            if (this.camera1) {
                renderer.three.scene.remove(this.camera1);
            }
            if (this.camera2) {
                renderer.three.scene.remove(this.camera2);
            }
        }
    }
}