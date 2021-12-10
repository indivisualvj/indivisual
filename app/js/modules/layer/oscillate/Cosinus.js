/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OscillatePlugin} from "../OscillatePlugin";
import {Oscillators} from "../../../shared/Oscillators";

class cosinus extends OscillatePlugin {
    static name = 'cosinus -1/1 (current)';
    static index = 50;

    apply(key) {
        let layer = this.layer;
        let speed = layer.currentSpeed();
        return this.activate(key, Oscillators.cosinus(speed.prc));
    }
}


class cosinout extends OscillatePlugin {
    static name = 'cosinus 0/1 (current)';
    static index = 50;

    apply(key) {
        let layer = this.layer;
        let speed = layer.currentSpeed();
        return this.activate(key, Oscillators.cosInOut(speed.prc));
    }
}


class cosinoutdotfive extends OscillatePlugin {
    static name = 'cosinus 0.5/1.5 (current)';
    static index = 50;

    apply(key) {
        let layer = this.layer;
        let speed = layer.currentSpeed();
        return this.activate(key, Oscillators.cosInOut(speed.prc, .5));
    }
}


class cosinouthexa extends OscillatePlugin {
    static name = 'cosinus 0/1 (hexa)';
    static index = 50;

    apply(key) {
        let speed = this.beatKeeper.getSpeed('hexa');
        return this.activate(key, Oscillators.cosInOut(speed.prc));
    }
}


class cosinoutdotfivehexa extends OscillatePlugin {
    static name = 'cosinus 0.5/1.5 (hexa)';
    static index = 50;

    apply(key) {
        let speed = this.beatKeeper.getSpeed('hexa');
        return this.activate(key, Oscillators.cosInOut(speed.prc, .5));
    }
}


class cosinoutdotfive32 extends OscillatePlugin {
    static name = 'cosinus 0.5/1.5 (32)';
    static index = 50;

    apply(key) {
        let speed = this.beatKeeper.getSpeed('32');
        return this.activate(key, Oscillators.cosInOut(speed.prc, .5));
    }
}


class cosinusfulls extends OscillatePlugin {
    static name = 'cosinus -1/1 (fulls)';
    static index = 50;

    apply(key) {
        let speed = this.beatKeeper.getSpeed('full');
        return this.activate(key, Oscillators.cosinus(speed.prc));
    }
}


class cosinus32 extends OscillatePlugin {
    static name = 'cosinus -1/1 (32)';
    static index = 50;

    apply(key) {
        let speed = this.beatKeeper.getSpeed('32');
        return this.activate(key, Oscillators.cosinus(speed.prc));
    }
}


class cosinus64 extends OscillatePlugin {
    static name = 'cosinus -1/1 (64)';
    static index = 50;

    apply(key) {
        let speed = this.beatKeeper.getSpeed('64');
        return this.activate(key, Oscillators.cosinus(speed.prc));
    }
}


class oscillator extends OscillatePlugin {
    static name = 'oscillate';
    static index = 50;
    osci = {
        osci1_period: 1,
        osci1_amp: 1,
        osci2_period: 0,
        osci2_amp: 0,
        osci3_period: 0,
        osci3_amp: 0,
        rhythm: 'half',
    };

    apply(key) {
        for (const osciKey in this.osci) {
            if (osciKey !== 'tempo') {
                this.osci[osciKey] = this.settings[osciKey];
            }
        }
        this.osci.tempo = this.config.ControlSettings.tempo;

        return this.activate(key, Oscillators.wobble(this.beatKeeper, 0, this.osci));
    }
}


class cosinusosci1 extends OscillatePlugin {
    static name = 'cosinus by osci1_period';
    static index = 50;
    osci = {
        osci1_period: 1,
        osci1_amp: 1,
        osci2_period: 0,
        osci2_amp: 0,
        osci3_period: 0,
        osci3_amp: 0,
        rhythm: 'half',
        tempo: 120,
    };

    apply(key) {
        this.osci.tempo = this.config.ControlSettings.tempo;
        this.osci.osci1_period = this.settings.osci1_period;
        this.osci.rhythm = this.settings.rhythm;
        return this.activate(key, Oscillators.wobble(this.beatKeeper, 0, this.osci, Math.cos));

    }
}


class cosinusosci2 extends OscillatePlugin {
    static name = 'cosinus by osci2_period';
    static index = 50;
    osci = {
        osci1_period: 0,
        osci1_amp: 0,
        osci2_period: 1,
        osci2_amp: 1,
        osci3_period: 0,
        osci3_amp: 0,
        rhythm: 'half',
        tempo: 120,
    };

    apply(key) {
        this.osci.tempo = this.config.ControlSettings.tempo;
        this.osci.osci2_period = this.settings.osci2_period;
        this.osci.rhythm = this.settings.rhythm;
        return this.activate(key, Oscillators.wobble(this.beatKeeper, 0, this.osci, Math.cos));

    }
}


class cosinusosci3 extends OscillatePlugin {
    static name = 'cosinus by osci3_period';
    static index = 50;
    osci = {
        osci1_period: 0,
        osci1_amp: 0,
        osci2_period: 0,
        osci2_amp: 0,
        osci3_period: 1,
        osci3_amp: 1,
        rhythm: 'half',
        tempo: 120,
    };

    apply(key) {
        this.osci.tempo = this.config.ControlSettings.tempo;
        this.osci.osci3_period = this.settings.osci3_period;
        this.osci.rhythm = this.settings.rhythm;
        return this.activate(key, Oscillators.wobble(this.beatKeeper, 0, this.osci, Math.cos));

    }
}

export {
    cosinout,
    cosinouthexa,
    cosinoutdotfivehexa,
    cosinus32,
    cosinus64,
    cosinusosci1,
    cosinusosci3,
    cosinusosci2,
    cosinusfulls,
    cosinus,
    cosinoutdotfive,
    cosinoutdotfive32
};
