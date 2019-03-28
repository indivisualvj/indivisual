/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.plugins.background_mode = HC.plugins.background_mode || {};
{
    HC.BackgroundModePlugin = class BackgroundModePlugin extends HC.AnimationPlugin {
        static background = [];

        /**
         *
         * @param background
         * @returns {*}
         */
        current(background) {
            if (background !== undefined) {
                HC.BackgroundModePlugin.background[this.layer.index] = background;
            }

            return HC.BackgroundModePlugin.background[this.layer.index];
        }

        updateTexture(texture) {
            let wraps = THREE[this.settings.background_wraps];
            if (texture.wrapS != wraps) {
                texture.wrapS = wraps;
                if (texture.image) {
                    texture.needsUpdate = true;
                }
            }
            let wrapt = THREE[this.settings.background_wrapt];
            if (texture.wrapT != wrapt) {
                texture.wrapT = wrapt;
                if (texture.image) {
                    texture.needsUpdate = true;
                }
            }

            texture.repeat.set(this.settings.background_repeatx, this.settings.background_repeaty);
            texture.offset.set(-this.settings.background_offsetx, this.settings.background_offsety);
            texture.rotation = RAD * this.settings.background_rotation;
            texture.center.set(this.settings.background_centerx, this.settings.background_centery);
        }

        id(suffix) {
            return super.id(suffix) + this.settings.background_volume + this.settings.background_color + this.settings.background_input;
        }

        reset() {
            this.layer.setBackground(this.current(''));
        }
    }
}

