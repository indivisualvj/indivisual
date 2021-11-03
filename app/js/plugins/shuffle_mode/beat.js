{
    HC.shuffle_mode.forward = class Plugin extends HC.ShuffleModePlugin {
        static name = 'forward (beat)';
        static index = 5;
        beats = 0;

        apply() {
            this.beats += (this.beatKeeper.getDefaultSpeed().prc==0?1:0);
            let every = this.settings.shuffle_every;

            if (this.beats >= every) {
                this.beats = 0;
                this.next();

            } else {
                return false;
            }
        }

        next() {
            this.layer++;

            if (this.layer >= this.config.ControlValues.layers) {
                this.layer = 0;
            }
        }
    }
}
{
    HC.shuffle_mode.backward = class Plugin extends HC.shuffle_mode.forward {
        static name = 'backward (beat)';
        static index = 6;

        next() {
            this.layer--;

            if (this.layer < 0) {
                this.layer = this.config.ControlValues.layers - 1;
            }
        }
    }
}
{
    HC.shuffle_mode.random = class Plugin extends HC.shuffle_mode.forward {
        static name = 'random (beat)';
        static index = 7;

        next() {
            let pile = [];
            for(let i = 0; i < this.config.ControlValues.layers; i++) {
                if (layerShuffleable(i) && !this.animation.settingsManager.isDefault(i)) {
                    pile.push(i);
                }
            }

            if (pile.length) {
                this.layer = pile[randomInt(0, pile.length - 1, false)];
            }
        }
    }
}
