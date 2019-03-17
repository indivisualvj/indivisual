{
    HC.plugins.background_mode.cube = class Plugin extends HC.BackgroundModePlugin {

        apply() {
            if (this.current() !== this.id()) {
                this.current(this.id());

                let color = new THREE.Color(this.settings.background_color);
                let res = this.layer.resolution().clone();
                res.multiplyScalar(2.5);
                let geo = new THREE.BoxBufferGeometry(res.x, res.y, res.x);
                let mat = new THREE.MeshStandardMaterial({
                    color: color,
                    side: THREE.DoubleSide,
                    // transparent: true
                });
                let mesh = new THREE.Mesh(geo, mat);
                mesh.scale.multiplyScalar(this.settings.background_volume);
                mesh.scale.x *= -1;
                mesh.receiveShadow = true;

                this.layer.setBackground(mesh);

                let file = assetman.getImage(this.settings.background_input);
                if (file) {
                    let inst = this;
                    assetman.loadTexture(filePath(IMAGE_DIR, file), function (tex) {
                        tex.wrapS = THREE.RepeatWrapping;
                        tex.repeat.x = -1;
                        mat.map = tex;
                        mat.emissiveMap = tex;
                        mat.needsUpdate = true;
                        inst.texture = tex;
                    });
                }
            }
        }
    }
}