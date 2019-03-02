{
    HC.plugins.background_mode.cube = class Plugin extends HC.BackgroundModePlugin {
        apply() {
            if (this.current() !== this._settingID()) {
                this.current(this._settingID());

                var color = new THREE.Color(this.settings.background_color);
                var res = this.layer.resolution().clone();
                res.multiplyScalar(this.settings.background_volume * 2.5);
                var geo = new THREE.BoxBufferGeometry(res.x, res.y, res.x);
                var mat = new THREE.MeshStandardMaterial({color: color, side: THREE.DoubleSide});
                var mesh = new THREE.Mesh(geo, mat);
                mesh.receiveShadow = true;

                this.layer.setBackground(mesh);

                var file = assetman.getImage(this.settings.background_input);
                if (file) {
                    new THREE.TextureLoader().load(filePath(IMAGE_DIR, file), function (tex) {
                        tex.wrapS = THREE.RepeatWrapping;
                        tex.repeat.x = -1;
                        mat.map = tex;
                        mat.emissiveMap = tex;
                        mat.needsUpdate = true;
                    });
                }
            }
        }
    }
}