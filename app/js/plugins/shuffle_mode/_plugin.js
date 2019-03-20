HC.shuffle_mode = HC.shuffle_mode || {};
{
    HC.ShuffleModePlugin = class ShuffleModePlugin {
        settings;
        layer = 0;

        constructor(settings) {
            this.settings = settings;
        }

        after() {
            for(let i = 0; i < statics.ControlValues.layer.length && !this.validate(); i++) {
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
                let isdefault = renderer.layers[this.layer].settings.isDefault();
                if (!isdefault) {
                    // alright!
                    return true;
                }
            }

            console.log('shuffle_mode.random.validate', this.layer, false);

            return false;
        }
    }
}