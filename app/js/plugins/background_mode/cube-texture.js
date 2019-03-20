{
    HC.plugins.background_mode.cubetexture = class Plugin extends HC.BackgroundModePlugin {
        static index = 40;

        apply() {
            let i = this.settings.background_input;
            let id = this.id();

            if (this.current() != id) {
                let file = assetman.getCube(i);
                if (file) {
                    this.current(id);
                    let inst = this;
                    let path = filePath(CUBE_DIR, file);
                    assetman.loadCubeTexture(path, function (texture) {
                        inst.texture = texture; // todo dispose texture
                        inst.layer.setBackground(texture);
                    });

                } else {
                    this.layer.setBackground(this.current(false));
                }
            }
        }
    }
}