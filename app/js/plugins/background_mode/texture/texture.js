{
    HC.plugins.background_mode.texture = class Plugin extends HC.TextureBackgroundModePlugin {
        static index = 40;

        apply() {
            let i = this.settings.background_input;
            let id = this.id();

            if (this.current() != id) {
                this.dispose();

                let file = assetman.getImage(i);
                if (file) {
                    this.current(id);
                    let inst = this;
                    let path = filePath(IMAGE_DIR, file);

                    assetman.loadTexture(path, function (texture) {
                        texture.center.set(.5, .5);
                        inst.texture = texture;

                        inst.layer.setBackground(texture);
                    });

                } else {
                    this.layer.setBackground(this.current(false));
                }
            }
        }
    }
}