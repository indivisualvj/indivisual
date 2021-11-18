/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.TextureBackgroundModePlugin = class TextureBackgroundModePlugin extends HC.BackgroundModePlugin {

        texture;

        after() {
            if (!super.after() && this.texture) {
                this.updateTexture(this.texture, 'background');
            }
        }

        needsUpdate(suffix) {

            let map = this.layer.getBackgroundMap();
            if (map) {
                return super.needsUpdate(map.key);
            }

            return super.needsUpdate(suffix);
        }

        _dispose() {
            threeTraverse(this);
        }
    }
}