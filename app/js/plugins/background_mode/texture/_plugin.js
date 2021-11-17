/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.TextureBackgroundModePlugin = class TextureBackgroundModePlugin extends HC.BackgroundModePlugin {

        texture;

        after() {
            if (this.texture) {
                this.updateTexture(this.texture, 'background');
            }
        }

        _dispose() {
            threeTraverse(this);
        }
    }
}