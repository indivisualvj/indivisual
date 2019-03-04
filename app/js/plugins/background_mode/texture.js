{
    HC.plugins.background_mode.texture = class Plugin extends HC.BackgroundModePlugin {
        static index = 40;
        img;

        apply() {
            let i = this.settings.background_input;
            let id = this.id() + i;

            if (this.current() != id) {
                let file = assetman.getImage(i);
                if (file) {
                    this.current(id);
                    let inst = this;
                    let path = filePath(IMAGE_DIR, file);

                    new THREE.TextureLoader().load(path, function (texture) {
                        texture.center.set(.5, .5);
                        inst.img = texture;

                        inst.layer.setBackground(texture);
                    });

                } else {
                    this.layer.setBackground(this.current(false));
                }
            }

            if (this.img) {
                let v = 1 / this.settings.background_volume;
                if (this.img.repeat.x != v) {
                    this.img.repeat.set(v, v);
                }
            }
        }

        dispose() {
            if (this.img && this.img.dispose) {
                this.img.dispose();
            }
        }
    }
}