/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.Renderer = HC.Renderer || {};
HC.Renderer.shuffle_mode = {};

{
    HC.ShuffleModePlugin = class ShuffleModePlugin {
        settings;
        layer = 0;

        /**
         * @type {HC.Renderer}
         */
        renderer;

        /**
         * @type {Config}
         */
        config;

        /**
         * @type {HC.BeatKeeper}
         */
        beatKeeper;

        /**
         *
         * @param {HC.Renderer} renderer
         * @param settings
         */
        constructor(renderer, settings) {
            this.renderer = renderer;
            this.config = renderer.config;
            this.beatKeeper = renderer.beatKeeper;
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
            if (this.config.shuffleable(i + 1) && !this.renderer.animation.settingsManager.isDefault(i)) {
                // alright!
                return true;
            }

            return false;
        }
    }
}
