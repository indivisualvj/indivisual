/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {BackgroundModePlugin} from "./BackgroundModePlugin";

class TextureBackgroundModePlugin extends BackgroundModePlugin {

        texture;

        after() {
            if (!super.after() && this.texture) {
                this.updateTexture(this.texture, 'background');
            }
        }

        needsUpdate(suffix) {

            let map = this.layer.getOverrideBackgroundMode();
            if (map) {
                return super.needsUpdate(map.key);
            }

            return super.needsUpdate(suffix);
        }

        _dispose() {
            HC.traverse(this);
        }
    }

export {TextureBackgroundModePlugin};
