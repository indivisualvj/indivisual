/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
HC.shuffle_mode = HC.shuffle_mode || {};
{
    /**
     *
     * @type {HC.ShuffleModePlugin}
     */
    HC.ShuffleModePlugin = class ShuffleModePlugin {
        settings;
        layer = 0;

        /**
         * @type {HC.Animation}
         */
        animation;

        /**
         * @type {HC.Config}
         */
        config;

        /**
         * @type {HC.BeatKeeper}
         */
        beatKeeper;

        /**
         *
         * @param {HC.Animation} animation
         * @param settings
         */
        constructor(animation, settings) {
            this.animation = animation;
            this.config = animation.config;
            this.beatKeeper = animation.beatKeeper;
            this.settings = settings;
        }

        after() {
            for(let i = 0; i < this.config.ControlValues.layers && !this.validate(); i++) {
                this.next();
            }

            if (!this.validate()) {
                return false;
            }

            return this.layer;
        }

        next() {
            console.error('.next() must be implemented in derived plugin')
        }

        validate() {

            let shuffleable = layerShuffleable(this.layer);
            if (shuffleable) {
                let isdefault = this.animation.settingsManager.isDefault(this.layer);
                if (!isdefault) {
                    // alright!
                    return true;
                }
            }

            return false;
        }
    }
}
