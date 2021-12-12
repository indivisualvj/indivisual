/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {TextureBackgroundModePlugin} from "../TextureBackgroundModePlugin";

class texture extends TextureBackgroundModePlugin {
        static index = 40;

        apply() {
            let i = this.settings.background_input;
            let id = this.id();

            if (this.needsUpdate()) {
                this._dispose();

                let file = this.config.getAssetManager().getImage(i);
                if (file) {
                    this.current(id);
                    let inst = this;
                    let path = filePath(IMAGE_DIR, file);

                    this.config.getAssetManager().loadTexture(path, function (texture) {
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

export {texture};
