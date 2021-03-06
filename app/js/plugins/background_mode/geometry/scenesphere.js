/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.plugins.background_mode.scenesphere = class Plugin extends HC.GeometryBackgroundModePlugin {
        static index = 61;
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

                this.target1 = new THREE.WebGLRenderTarget(edge, edge);
                this.target2 = this.target1.clone();

                let geo = new THREE.SphereBufferGeometry(res.length() * 2, 16, 16);
                geo.rotateY(Math.PI / 2);

                this.material = new THREE.MeshBasicMaterial({
                    color: color,
                    side: THREE.DoubleSide,
                    map: this.target1.texture,
                    transparent: true
                });

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
                    // this.material.needsUpdate = true;
                    this.layer.three.renderer.render(this.layer.three.scene, this.layer.three.camera, this.target1);

                } else {
                    this.texture = this.target1.texture;
                    this.material.map = this.texture;
                    // this.material.needsUpdate = true;
                    this.layer.three.renderer.render(this.layer.three.scene, this.layer.three.camera, this.target2);
                }

                this.counter ++;
            }
        }
    }
}