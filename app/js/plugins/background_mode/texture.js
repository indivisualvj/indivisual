{
    HC.plugins.background_mode.texture = class Plugin extends HC.BackgroundModePlugin {
        static index = 40;

        apply() {
            let i = this.settings.background_input;
            let id = this.id();

            if (this.current() != id) {
                let file = assetman.getImage(i);
                if (file) {
                    this.current(id);
                    let inst = this;
                    let path = filePath(IMAGE_DIR, file);

                    new THREE.TextureLoader().load(path, function (texture) {
                        texture.center.set(.5, .5);
                        inst.texture = texture;

                        inst.layer.setBackground(texture);
                    });

                } else {
                    this.layer.setBackground(this.current(false));
                }
            }

            // if (this.texture) {
            //     let v = 1 / this.settings.background_volume;
            //     if (this.texture.repeat.x != v) {
            //         this.texture.repeat.set(v, v);
            //     }
            // }
        }
    }
}