/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {TextureBackgroundModePlugin} from "../TextureBackgroundModePlugin";

class cubetexture extends TextureBackgroundModePlugin {
        static index = 41;

        apply() {
            let i = this.settings.background_input;
            let id = this.id();

            if (this.needsUpdate()) {
                this._dispose();

                let file = this.config.getAssetManager().getCube(i);
                if (file) {
                    this.current(id);
                    let path = HC.filePath(CUBE_DIR, file);

                    this.config.getAssetManager().loadCubeTexture(path, (texture) => {
                        this.texture = texture;
                        this.layer.setBackground(texture);
                    });

                } else {
                    this.layer.setBackground(this.current(false));
                }
            }
        }
    }

export {cubetexture};
