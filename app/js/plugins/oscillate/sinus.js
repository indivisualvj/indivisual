{
    HC.plugins.oscillate.sinus = class Plugin extends HC.OscillatePlugin {
        static name = 'sinus -1/1 (current)';
        static index = 40;

        apply(key) {
            let layer = this.layer;
            let speed = layer.getCurrentSpeed();
            return this.activate(key, HC.Osci.sinus(speed.prc));
        }
    }
}
{
    HC.plugins.oscillate.sininout = class Plugin extends HC.OscillatePlugin {
        static name = 'sinus 0/1 (current)';
        static index = 40;

        apply(key) {
            let layer = this.layer;
            let speed = layer.getCurrentSpeed();
            return this.activate(key, HC.Osci.sinInOut(speed.prc));
        }
    }
}
{
    HC.plugins.oscillate.sininoutdotfive = class Plugin extends HC.OscillatePlugin {
        static name = 'sinus 0.5/1.5 (current)';
        static index = 40;

        apply(key) {
            let layer = this.layer;
            let speed = layer.getCurrentSpeed();
            return this.activate(key, HC.Osci.sinInOut(speed.prc, .5));
        }
    }
}
{
    HC.plugins.oscillate.sininouthexa = class Plugin extends HC.OscillatePlugin {
        static name = 'sinus 0/1 (hexa)';
        static index = 40;

        apply(key) {
            let speed = this.beatKeeper.getSpeed('hexa');
            return this.activate(key, HC.Osci.sinInOut(speed.prc));
        }
    }
}
{
    HC.plugins.oscillate.sininoutdotfivehexa = class Plugin extends HC.OscillatePlugin {
        static name = 'sinus 0.5/1.5 (hexa)';
        static index = 40;

        apply(key) {
            let speed = this.beatKeeper.getSpeed('hexa');
            return this.activate(key, HC.Osci.sinInOut(speed.prc, .5));
        }
    }
}
{
    HC.plugins.oscillate.sininoutdotfive32 = class Plugin extends HC.OscillatePlugin {
        static name = 'sinus 0.5/1.5 (32)';
        static index = 40;

        apply(key) {
            let speed = this.beatKeeper.getSpeed('32');
            return this.activate(key, HC.Osci.sinInOut(speed.prc, .5));
        }
    }
}
{
    HC.plugins.oscillate.sinusfulls = class Plugin extends HC.OscillatePlugin {
        static name = 'sinus -1/1 (fulls)';
        static index = 40;

        apply(key) {
            let speed = this.beatKeeper.getSpeed('full');
            return this.activate(key, HC.Osci.sinus(speed.prc));
        }
    }
}
{
    HC.plugins.oscillate.sinus32 = class Plugin extends HC.OscillatePlugin {
        static name = 'sinus -1/1 (32)';
        static index = 40;

        apply(key) {
            let layer = this.layer;
            let speed = this.beatKeeper.getSpeed('32');
            return this.activate(key, HC.Osci.sinus(speed.prc));
        }
    }
}
{
    HC.plugins.oscillate.sinus64 = class Plugin extends HC.OscillatePlugin {
        static name = 'sinus -1/1 (64)';
        static index = 40;

        apply(key) {
            let speed = this.beatKeeper.getSpeed('64');
            return this.activate(key, HC.Osci.sinus(speed.prc));
        }
    }
}
{
    HC.plugins.oscillate.oscillator = class Plugin extends HC.OscillatePlugin {
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
}
{
    HC.plugins.oscillate.sinusosci1 = class Plugin extends HC.OscillatePlugin {
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
}
{
    HC.plugins.oscillate.sinusosci2 = class Plugin extends HC.OscillatePlugin {
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
}
    {
        HC.plugins.oscillate.sinusosci3 = class Plugin extends HC.OscillatePlugin {
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
    }
