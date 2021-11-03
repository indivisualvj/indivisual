/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.plugins.background_mode = HC.plugins.background_mode || {};
{
    HC.BackgroundModePlugin = class BackgroundModePlugin extends HC.AnimationTexturePlugin {
        static background = [];

        setControlSets(controlSets) {
            super.setControlSets(controlSets);
            // make all such plugins make use of corresponding controlset only
            this.settings = controlSets.background.properties;
        }

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

        id(suffix) {
            return super.id(suffix) + this.settings.background_volume + this.settings.background_color + this.settings.background_input;
        }

        reset() {
            this.layer.setBackground(this.current(''));
        }
    }
}

