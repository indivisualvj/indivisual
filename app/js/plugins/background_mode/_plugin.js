HC.plugins.background_mode = HC.plugins.background_mode || {};
{
    HC.BackgroundModePlugin = class Plugin extends HC.AnimationPlugin {
        background = false;
        texture;

        after() {
            if (this.texture) {
                let wraps = THREE[this.settings.background_wraps];
                if (this.texture.wrapS != wraps) {
                    this.texture.wrapS = wraps;
                    this.texture.needsUpdate = true;
                }
                let wrapt = THREE[this.settings.background_wrapt];
                if (this.texture.wrapT != wrapt) {
                    this.texture.wrapT = wrapt;
                    this.texture.needsUpdate = true;
                }

                this.texture.repeat.set(this.settings.background_repeatx, this.settings.background_repeaty);
                this.texture.offset.set(-this.settings.background_offsetx, this.settings.background_offsety);
                this.texture.rotation = RAD * this.settings.background_rotation;

                if (this.texture.center) {
                    this.texture.center.set(this.settings.background_centerx, this.settings.background_centery);

                } else if (this.texture.texture) {
                    this.texture.texture.center.set(this.settings.background_centerx, this.settings.background_centery);
                }
            }
        }

        /**
         * Manipulate the static background property to have a BackgroundMode wide status
         *
         * @param background
         * @returns {boolean}
         */
        current(background) {
            if (background !== undefined) {
                // manipulate prototype instead of direct to avoid having to call HC.BackgroundModePlugin.current on the other hand.
                this.background = background;
            }

            return this.background;
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

