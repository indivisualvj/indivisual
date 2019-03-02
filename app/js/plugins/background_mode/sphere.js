{
    HC.plugins.background_mode.sphere = class Plugin extends HC.BackgroundModePlugin {
        apply() {
            if (this.current() !== this._settingID()) {
                this.current(this._settingID());

                let color = new THREE.Color(this.settings.background_color);
                let res = this.layer.resolution().clone();
                res.multiplyScalar(this.settings.background_volume);
                let geo = new THREE.SphereBufferGeometry(res.length() * 2, 16, 16);
                geo.rotateY(Math.PI / 2);
                let mat = new THREE.MeshStandardMaterial({color: color, side: THREE.DoubleSide});
                let mesh = new THREE.Mesh(geo, mat);
                mesh.receiveShadow = true;

                this.layer.setBackground(mesh);

                let file = assetman.getImage(this.settings.background_input);
                if (file) {
                    new THREE.TextureLoader().load(filePath(IMAGE_DIR, file), function (tex) {

                        // tex.wrapS = THREE.MirroredRepe atWrapping;
                        // tex.repeat.x = - 2;
                        tex.wrapS = THREE.RepeatWrapping;
                        tex.repeat.x = -1;
                        mat.map = tex;
                        // mat.color.setHSL(0, 0, 1);
                        mat.emissiveMap = tex;
                        // tex.mapping = THREE.SphericalReflectionMapping;
                        // tex.wrapS = THREE.MirroredRepeatWrapping;
                        mat.needsUpdate = true;
                    });
                }
            }
        }
    }
}