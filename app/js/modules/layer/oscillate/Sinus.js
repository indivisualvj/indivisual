/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OscillatePlugin} from "../OscillatePlugin";

class sinus extends OscillatePlugin {
        static name = 'sinus -1/1 (current)';
        static index = 40;

        apply(key) {
            let layer = this.layer;
            let speed = layer.currentSpeed();
            return this.activate(key, HC.Osci.sinus(speed.prc));
        }
    }


    class sininout extends OscillatePlugin {
        static name = 'sinus 0/1 (current)';
        static index = 40;

        apply(key) {
            let layer = this.layer;
            let speed = layer.currentSpeed();
            return this.activate(key, HC.Osci.sinInOut(speed.prc));
        }
    }


    class sininoutdotfive extends OscillatePlugin {
        static name = 'sinus 0.5/1.5 (current)';
        static index = 40;

        apply(key) {
            let layer = this.layer;
            let speed = layer.currentSpeed();
            return this.activate(key, HC.Osci.sinInOut(speed.prc, .5));
        }
    }


    class sininouthexa extends OscillatePlugin {
        static name = 'sinus 0/1 (hexa)';
        static index = 40;

        apply(key) {
            let speed = this.beatKeeper.getSpeed('hexa');
            return this.activate(key, HC.Osci.sinInOut(speed.prc));
        }
    }


    class sininoutdotfivehexa extends OscillatePlugin {
        static name = 'sinus 0.5/1.5 (hexa)';
        static index = 40;

        apply(key) {
            let speed = this.beatKeeper.getSpeed('hexa');
            return this.activate(key, HC.Osci.sinInOut(speed.prc, .5));
        }
    }


    class sininoutdotfive32 extends OscillatePlugin {
        static name = 'sinus 0.5/1.5 (32)';
        static index = 40;

        apply(key) {
            let speed = this.beatKeeper.getSpeed('32');
            return this.activate(key, HC.Osci.sinInOut(speed.prc, .5));
        }
    }


    class sinusfulls extends OscillatePlugin {
        static name = 'sinus -1/1 (fulls)';
        static index = 40;

        apply(key) {
            let speed = this.beatKeeper.getSpeed('full');
            return this.activate(key, HC.Osci.sinus(speed.prc));
        }
    }


    class sinus32 extends OscillatePlugin {
        static name = 'sinus -1/1 (32)';
        static index = 40;

        apply(key) {
            let layer = this.layer;
            let speed = this.beatKeeper.getSpeed('32');
            return this.activate(key, HC.Osci.sinus(speed.prc));
        }
    }


    class sinus64 extends OscillatePlugin {
        static name = 'sinus -1/1 (64)';
        static index = 40;

        apply(key) {
            let speed = this.beatKeeper.getSpeed('64');
            return this.activate(key, HC.Osci.sinus(speed.prc));
        }
    }


    class oscillator extends OscillatePlugin {
        static name = 'oscillator';
        static index = 40;
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
            return this.activate(key, HC.Osci.wobble(this.beatKeeper, 0, this.osci));
        }
    }


    class sinusosci1 extends OscillatePlugin {
        static name = 'sinus by osci1_period';
        static index = 40;
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
            return this.activate(key, HC.Osci.wobble(this.beatKeeper, 0, this.osci));

        }
    }


    class sinusosci2 extends OscillatePlugin {
        static name = 'sinus by osci2_period';
        static index = 40;
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
            return this.activate(key, HC.Osci.wobble(this.beatKeeper, 0, this.osci));

        }
    }
        class sinusosci3 extends OscillatePlugin {
            static name = 'sinus by osci3_period';
            static index = 40;
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
                return this.activate(key, HC.Osci.wobble(this.beatKeeper, 0, this.osci));

            }
        }


export {sininoutdotfive32, sininoutdotfive, sininoutdotfivehexa, sininouthexa, sinus, sinus64, sinusosci1, sinusosci2, sinusosci3, sinus32, sinusfulls, sininout, oscillator};
