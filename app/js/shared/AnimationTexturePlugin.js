/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationPlugin} from "./AnimationPlugin";

class AnimationTexturePlugin extends AnimationPlugin
{
    /**
     *
     * @param texture {THREE.Texture}
     * @param prefix
     */
    updateTexture(texture, prefix) {
        let wraps = THREE[this.settings[prefix + '_wraps']];
        if (texture.wrapS !== wraps) {
            texture.wrapS = wraps;
            if (texture.image) {
                texture.needsUpdate = true;
            }
        }
        let wrapt = THREE[this.settings[prefix + '_wrapt']];
        if (texture.wrapT !== wrapt) {
            texture.wrapT = wrapt;
            if (texture.image) {
                texture.needsUpdate = true;
            }
        }

        texture.repeat.set(this.settings[prefix + '_repeatx'], this.settings[prefix + '_repeaty']);
        texture.offset.set(-this.settings[prefix + '_offsetx'], this.settings[prefix + '_offsety']);
        texture.rotation = RAD * this.settings[prefix + '_rotation'];
        texture.center.set(this.settings[prefix + '_centerx'], this.settings[prefix + '_centery']);
    }
}

export {AnimationTexturePlugin};
