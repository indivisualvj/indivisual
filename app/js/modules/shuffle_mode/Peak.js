/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class ForwardPeak extends ShuffleModePlugin {
    static name = 'forward (peak)';
    static index = 10;
    static peaks = 0;

    apply() {
        let every = this.settings.shuffle_every;

        if (ForwardPeak.peaks >= every) {
            ForwardPeak.peaks = 0;
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

    static boot(initiator, config) {
        config.getEventManager().register(EVENT_AUDIO_PEAK, this.objectName, () => {
            ForwardPeak.peaks++;
        });
    }
}

export {ForwardPeak}

class BackwardPeak extends ForwardPeak {
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

export {BackwardPeak}

class RandomPeak extends ForwardPeak {
    static name = 'random (peak)';
    static index = 12;

    next() {
        let pile = this.getPile();

        this.layer = pile.length ? randomInt(0, pile.length - 1, false) : 0;
    }
}

export {RandomPeak}