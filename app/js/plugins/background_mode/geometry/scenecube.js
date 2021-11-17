// todo: create sequencecube0-5 backgrounds

/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.plugins.background_mode.scenecube = class Plugin extends HC.GeometryBackgroundModePlugin {
        static index = 60;
        material;
        counter = 0;
        target1;
        target2;

        apply() {
            if (this.current() !== this.id()) {
                this.current(this.id());

                let color = new THREE.Color(this.settings.background_color);
                let res = this.layer.resolution().clone();
                let edge = Math.min(res.x, res.y);

                let wraps = THREE[this.settings.background_wraps];
                let wrapt = THREE[this.settings.background_wrapt];
                this.target1 = new THREE.WebGLRenderTarget(edge, edge, {
                    wrapT: wrapt, wrapS: wraps
                });

                this.target2 = new THREE.WebGLRenderTarget(edge, edge, {
                    wrapT: wrapt, wrapS: wraps
                });


                res.multiplyScalar(2.5);
                let geo = new THREE.BoxBufferGeometry(res.x, res.y, res.x);
                this.geometry = geo;

                this.material = materialman.addMaterial(new THREE.MeshBasicMaterial({
                    color: color,
                    side: THREE.DoubleSide,
                    map: this.target1.texture,
                    transparent: true
                }));

                let mesh = new THREE.Mesh(geo, this.material);
                mesh.scale.multiplyScalar(this.settings.background_volume);
                mesh.scale.x *= -1;
                mesh.name = this.id();
                mesh.receiveShadow = true;
                this.mesh = mesh;

                this.layer.setBackground(mesh);

            } else {
                if (this.counter % 2) {
                    this.texture = this.target2.texture;
                    this.material.map = this.texture;

                    this.layer.three.renderer.setRenderTarget(this.target1);
                    this.layer.three.renderer.render(this.layer.three.scene, this.layer.three.camera);
                    this.layer.three.renderer.setRenderTarget(null);

                } else {
                    this.texture = this.target1.texture;
                    this.material.map = this.texture;

                    this.layer.three.renderer.setRenderTarget(this.target2);
                    this.layer.three.renderer.render(this.layer.three.scene, this.layer.three.camera);
                    this.layer.three.renderer.setRenderTarget(null);
                }

                this.counter ++;
            }
        }
    }
}
