HC.plugins.background_mode = HC.plugins.background_mode || {};
{
    HC.BackgroundModePlugin = class BackgroundModePlugin extends HC.AnimationPlugin {
        static background = false;
        texture;

        after() {
            if (this.texture) {
                let texture = this.texture;
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
        }

        /**
         * todo geht das nicht mit listener.reg(anim.updateSetting)??
         * Manipulate the static background property to have a BackgroundMode wide status
         *
         * @param background
         * @returns {boolean}
         */
        current(background) {
            if (background !== undefined) {
                // manipulate prototype instead of direct to avoid having to call HC.BackgroundModePlugin.current on the other hand.
                HC.BackgroundModePlugin.background = background;
            }

            return HC.BackgroundModePlugin.background;
        }

        id(suffix) {
            return super.id(suffix) + this.settings.background_volume + this.settings.background_color + this.settings.background_input;
        }

        dispose() {
            this.current('');

            if (this.texture) {
                this.texture.dispose();
            }
        }
    }
}

