{
    HC.plugins.background_mode.cubetexture = class Plugin extends HC.TextureBackgroundModePlugin {
        static index = 41;

        apply() {
            let i = this.settings.background_input;
            let id = this.id();

            if (this.current() !== id) {
                this._dispose();

                let file = assetman.getCube(i);
                if (file) {
                    this.current(id);
                    let path = filePath(CUBE_DIR, file);

                    assetman.loadCubeTexture(path, (texture) => {
                        this.texture = texture;
                        this.layer.setBackground(texture);
                    });

                } else {
                    this.layer.setBackground(this.current(false));
                }
            }
        }
    }
}