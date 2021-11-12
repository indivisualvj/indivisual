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
            if (!this.validate(this.getLayer())) {
                console.log('schuffle_mode.layer', 'fail');
                return false;
            }

            console.log('schuffle_mode.layer', this.getLayer());
            return this.getLayer();
        }

        next() {
            console.error('.next() must be implemented in derived plugin')
        }

        getLayer() {
            let pile = this.getPile();
            return pile.length ? pile[this.layer] : 0;
        }

        getPile() {
            let pile = [];
            for (let i = 0; i < this.config.ControlValues.layers; i++) {
                if (this.validate(i)) {
                    pile.push(i);
                }
            }
            return pile;
        }

        validate(i) {
            if (this.config.shuffleable(i + 1) && !this.animation.settingsManager.isDefault(i)) {
                // alright!
                return true;
            }

            return false;
        }
    }
}
