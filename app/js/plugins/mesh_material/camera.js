{
    HC.plugins.mesh_material.camera = class Plugin extends HC.MeshMaterialPlugin {
        camera;
        mesh;

        apply(geometry) {
            this.camera = new THREE.CubeCamera(1, 100000, 128);
            this.mesh.add(this.camera);

            let material = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: this.camera.renderTarget } );
            this.mesh = new Mesh( geometry, material );

            let inst = this;
            listener.register('animation.updateRuntime', 'HC.plugins.mesh_material', function (now) {
                // inst.camera.position.copy( inst.mesh.position );
                inst.camera.update(renderer.three.renderer, renderer.three.scene);
            });

            return this.mesh;
        }
    }
}