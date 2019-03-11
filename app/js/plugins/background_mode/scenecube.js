{
    HC.plugins.background_mode.scenecube = class Plugin extends HC.BackgroundModePlugin {
        static index = 50;
        material;
        counter = 0;
        target1;
        target2;

        apply(geometry, index) {
            if (this.current() !== this.id()) {
                this.current(this.id());

                let color = new THREE.Color(this.settings.background_color);
                let res = this.layer.resolution().clone();

                this.target1 = new THREE.WebGLRenderTarget(res.x, res.y);
                this.target2 = new THREE.WebGLRenderTarget(res.x, res.y);

                res.multiplyScalar(this.settings.background_volume * 2.5);
                let geo = new THREE.BoxBufferGeometry(res.x, res.y, res.x);


                this.material = new THREE.MeshBasicMaterial({
                    color: color,
                    // emissive: color,
                    side: THREE.DoubleSide,
                    map: this.target1.texture,
                    // emissiveMap: this.target.texture
                });

                let mesh = new THREE.Mesh(geo, this.material);
                mesh.name = this.id(index);
                mesh.receiveShadow = true;

                this.layer.setBackground(mesh);

            } else {

                if (this.counter % 2) {
                    this.material.map = this.target2.texture;
                    this.material.needsUpdate = true;
                    this.layer.three.renderer.render(this.layer.three.scene, this.layer.three.camera, this.target1);

                } else {
                    this.material.map = this.target1.texture;
                    this.material.needsUpdate = true;
                    this.layer.three.renderer.render(this.layer.three.scene, this.layer.three.camera, this.target2);
                }

                this.counter ++;
            }
        }
    }
}