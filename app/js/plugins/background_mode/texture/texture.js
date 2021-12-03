{
    HC.plugins.background_mode.texture = class Plugin extends HC.TextureBackgroundModePlugin {
        static index = 40;

        apply() {
            let i = this.settings.background_input;
            let id = this.id();

            if (this.needsUpdate()) {
                this._dispose();

                let file = AssetManager.getImage(i);
                if (file) {
                    this.current(id);
                    let inst = this;
                    let path = HC.filePath(IMAGE_DIR, file);

                    AssetManager.loadTexture(path, function (texture) {
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