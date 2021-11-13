{
    HC.shuffle_mode.forwardpeak = class Plugin extends HC.ShuffleModePlugin {
        static name = 'forward (peak)';
        static index = 10;
        peaks = 0;

        constructor(animation, settings) {
            super(animation, settings);

            let inst = this;

            this.animation.listener.register('audio.peak', this.objectName, function (target) {
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
    HC.shuffle_mode.backwardpeak = class Plugin extends HC.shuffle_mode.forwardpeak {
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
    HC.shuffle_mode.randompeak = class Plugin extends HC.shuffle_mode.forwardpeak {
        static name = 'random (peak)';
        static index = 12;

        next() {
            let pile = this.getPile();

            this.layer = pile.length ? randomInt(0, pile.length - 1, false) : 0;
        }
    }
}
