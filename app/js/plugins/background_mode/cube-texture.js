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
                    messaging.files(path, function (data) {

                        let images = [];
                        for (let k in data) {
                            images.push(data[k].name);
                        }
                        images.sort();

                        new THREE.CubeTextureLoader().setPath(filePath(path, '')).load(images, function (texture) {
                            inst.layer.setBackground(texture);
                        });
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