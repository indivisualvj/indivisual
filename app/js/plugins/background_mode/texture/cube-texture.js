{
    HC.plugins.background_mode.cubetexture = class Plugin extends HC.TextureBackgroundModePlugin {
        static index = 41;

        apply() {
            let i = this.settings.background_input;
            let id = this.id();

            if (this.current() !== id) {
                this.dispose();

                let file = assetman.getCube(i);
                if (file) {
                    this.current(id);
                    let inst = this;
                    let path = filePath(CUBE_DIR, file);

                    assetman.loadCubeTexture(path, function (texture) {

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