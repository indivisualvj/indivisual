{
    HC.plugins.mesh_material.camera = class Plugin extends HC.MeshMaterialPlugin {
        camera;
        mesh;

        apply(geometry) {
            this.camera = new THREE.CubeCamera(1, 100000, 128);
            renderer.three.scene.add(this.camera);

            let material = new THREE.MeshLambertMaterial({ color: 0xffffff, envMap: this.camera.renderTarget.texture });
            this.mesh = new THREE.Mesh( geometry, material );


            let inst = this;
            listener.register('renderer.render', this, function (now) {
                inst.camera.position.copy(inst.mesh.position);
                inst.camera.update(renderer.three.renderer, renderer.three.scene);
            });

            return this.mesh;
        }

        dispose() {
            if (this.camera) {
                renderer.three.scene.remove(this.camera);
            }
        }
    }
}