{
    HC.plugins.oscillate.sinus = class Plugin extends HC.OscillatePlugin {
        static name = 'sinus -1/1 (current)';
        static index = 40;

        apply(key) {
            let layer = this.layer;
            let speed = layer.getCurrentSpeed();
            this.activate(key, HC.Osci.sinus(speed.prc));
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
            this.activate(key, HC.Osci.sinInOut(speed.prc));
        }
    }
}
{
    HC.plugins.oscillate.sininouthexa = class Plugin extends HC.OscillatePlugin {
        static name = 'sinus 0/1 (hexa)';
        static index = 40;

        apply(key) {
            let speed = beatkeeper.getSpeed('hexa');
            this.activate(key, HC.Osci.sinInOut(speed.prc));
        }
    }
}
{
    HC.plugins.oscillate.sininoutdotfivehexa = class Plugin extends HC.OscillatePlugin {
        static name = 'sinus 0.5/1.5 (hexa)';
        static index = 40;

        apply(key) {
            let speed = beatkeeper.getSpeed('hexa');
            this.activate(key, HC.Osci.sinInOut(speed.prc, .5));
        }
    }
}
{
    HC.plugins.oscillate.sininoutdotfive32 = class Plugin extends HC.OscillatePlugin {
        static name = 'sinus 0.5/1.5 (32)';
        static index = 40;

        apply(key) {
            let speed = beatkeeper.getSpeed('32');
            this.activate(key, HC.Osci.sinInOut(speed.prc, .5));
        }
    }
}
{
    HC.plugins.oscillate.sinusfulls = class Plugin extends HC.OscillatePlugin {
        static name = 'sinus -1/1 (fulls)';
        static index = 40;

        apply(key) {
            let speed = beatkeeper.getSpeed('full');
            this.activate(key, HC.Osci.sinus(speed.prc));
        }
    }
}
{
    HC.plugins.oscillate.oscillator = class Plugin extends HC.OscillatePlugin {
        static name = 'oscillator';
        static index = 40;

        apply(key) {
            this.activate(key, HC.Osci.wobble(0, this.settings));
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
            rhythm: 'half'
        };

        apply(key) {
            this.osci.osci1_period = this.settings.osci1_period;
            this.osci.rhythm = this.settings.rhythm;
            this.activate(key, HC.Osci.wobble(0, this.osci));

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
            rhythm: 'half'
        };

        apply(key) {
            this.osci.osci2_period = this.settings.osci2_period;
            this.osci.rhythm = this.settings.rhythm;
            this.activate(key, HC.Osci.wobble(0, this.osci));

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
                rhythm: 'half'
            };

            apply(key) {
                this.osci.osci3_period = this.settings.osci3_period;
                this.osci.rhythm = this.settings.rhythm;
                this.activate(key, HC.Osci.wobble(0, this.osci));

            }
        }
    }