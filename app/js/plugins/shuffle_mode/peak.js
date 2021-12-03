{
    HC.Renderer.shuffle_mode.forwardpeak = class Plugin extends HC.ShuffleModePlugin {
        static name = 'forward (peak)';
        static index = 10;
        peaks = 0;

        constructor(renderer, settings) {
            super(renderer, settings);

            let inst = this;
            this.config.getEventManager().register(EVENT_AUDIO_PEAK, this.objectName, function (target) {
                inst.peaks++;
            });
        }

        apply() {
            let every = this.settings.shuffle_every;

            if (this.peaks >= every) {
                this.peaks = 0;
                this.next();

            } else {
                return false;
            }
        }

        next() {
            let pile = this.getPile();
            this.layer++;

            if (this.layer > pile.length - 1) {
                this.layer = 0;
            }
        }
    }
}
{
    HC.Renderer.shuffle_mode.backwardpeak = class Plugin extends HC.Renderer.shuffle_mode.forwardpeak {
        static name = 'backward (peak)';
        static index = 11;

        next() {
            let pile = this.getPile();
            this.layer--;

            if (this.layer < 0) {
                this.layer = pile.length - 1;
            }
        }
    }
}
{
    HC.Renderer.shuffle_mode.randompeak = class Plugin extends HC.Renderer.shuffle_mode.forwardpeak {
        static name = 'random (peak)';
        static index = 12;

        next() {
            let pile = this.getPile();

            this.layer = pile.length ? randomInt(0, pile.length - 1, false) : 0;
        }
    }
}
