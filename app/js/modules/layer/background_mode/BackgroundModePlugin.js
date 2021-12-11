/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {AnimationTexturePlugin} from "../../AnimationTexturePlugin";

class BackgroundModePlugin extends AnimationTexturePlugin {
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
                BackgroundModePlugin.background[this.layer.index] = background;
            }

            return BackgroundModePlugin.background[this.layer.index];
        }

        needsUpdate(suffix) {
            return this.id(suffix) !== this.current();
        }

        after() {
            let map = this.layer.getOverrideBackgroundMode();
            if (map) {
                if (map.properties.map && this.needsUpdate(map.key)) {
                    this.current(this.id(map.key));
                    this.texture = map.properties.map;
                    this.layer.setBackground(this.texture);
                }
                return true;
            }

            return false;
        }

        id(suffix) {
            return super.id(suffix) + this.settings.background_volume + this.settings.background_color + this.settings.background_input;
        }

        /**
         * use this in derived plugins to cleanup
         * @protected
         */
        _dispose() {

        }

        reset() {
            this.layer.setBackground(this.current(''));
            this._dispose();
        }
    }

export {BackgroundModePlugin};
