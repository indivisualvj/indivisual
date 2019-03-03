HC.plugins.background_mode = HC.plugins.background_mode || {};
{
    HC.BackgroundModePlugin = class Plugin extends HC.AnimationPlugin {
        static background = false;

        /**
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

        _settingID() {
            return this._id() + this.settings.background_volume + this.settings.background_color + this.settings.background_input;
        }

        dispose() {
            this.current('');
        }
    }
}

