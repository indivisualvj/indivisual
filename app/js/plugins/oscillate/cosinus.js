{
    HC.plugins.oscillate.cosinus = class Plugin extends HC.OscillatePlugin {
        static name = 'cosinus -1/1 (current)';
        static index = 50;

        apply(key) {
            let layer = this.layer;
            let speed = layer.getCurrentSpeed();
            return this.activate(key, HC.Osci.cosinus(speed.prc));
        }
    }
}
{
    HC.plugins.oscillate.cosinout = class Plugin extends HC.OscillatePlugin {
        static name = 'cosinus 0/1 (current)';
        static index = 50;

        apply(key) {
            let layer = this.layer;
            let speed = layer.getCurrentSpeed();
            return this.activate(key, HC.Osci.cosInOut(speed.prc));
        }
    }
}
{
    HC.plugins.oscillate.cosinoutdotfive = class Plugin extends HC.OscillatePlugin {
        static name = 'cosinus 0.5/1.5 (current)';
        static index = 50;

        apply(key) {
            let layer = this.layer;
            let speed = layer.getCurrentSpeed();
            return this.activate(key, HC.Osci.cosInOut(speed.prc, .5));
        }
    }
}
{
    HC.plugins.oscillate.cosinouthexa = class Plugin extends HC.OscillatePlugin {
        static name = 'cosinus 0/1 (hexa)';
        static index = 50;

        apply(key) {
            let speed = beatkeeper.getSpeed('hexa');
            return this.activate(key, HC.Osci.cosInOut(speed.prc));
        }
    }
}
{
    HC.plugins.oscillate.cosinoutdotfivehexa = class Plugin extends HC.OscillatePlugin {
        static name = 'cosinus 0.5/1.5 (hexa)';
        static index = 50;

        apply(key) {
            let speed = beatkeeper.getSpeed('hexa');
            return this.activate(key, HC.Osci.cosInOut(speed.prc, .5));
        }
    }
}
{
    HC.plugins.oscillate.cosinoutdotfive32 = class Plugin extends HC.OscillatePlugin {
        static name = 'cosinus 0.5/1.5 (32)';
        static index = 50;

        apply(key) {
            let speed = beatkeeper.getSpeed('32');
            return this.activate(key, HC.Osci.cosInOut(speed.prc, .5));
        }
    }
}
{
    HC.plugins.oscillate.cosinusfulls = class Plugin extends HC.OscillatePlugin {
        static name = 'cosinus -1/1 (fulls)';
        static index = 50;

        apply(key) {
            let speed = beatkeeper.getSpeed('full');
            return this.activate(key, HC.Osci.cosinus(speed.prc));
        }
    }
}
{
    HC.plugins.oscillate.oscillator = class Plugin extends HC.OscillatePlugin {
        static name = 'oscillate';
        static index = 50;

        apply(key) {
            return this.activate(key, HC.Osci.wobble(0, this.settings));
        }
    }
}
{
    HC.plugins.oscillate.cosinusosci1 = class Plugin extends HC.OscillatePlugin {
        static name = 'cosinus by osci1_period';
        static index = 50;
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
            return this.activate(key, HC.Osci.wobble(0, this.osci, Math.cos));

        }
    }
}
{
    HC.plugins.oscillate.cosinusosci2 = class Plugin extends HC.OscillatePlugin {
        static name = 'cosinus by osci2_period';
        static index = 50;
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
            return this.activate(key, HC.Osci.wobble(0, this.osci, Math.cos));

        }
    }
}
{
    HC.plugins.oscillate.cosinusosci3 = class Plugin extends HC.OscillatePlugin {
        osci = {
            osci1_period: 0,
            osci1_amp: 0,
            osci2_period: 0,
            osci2_amp: 0,
            osci3_period: 1,
            osci3_amp: 1,
            rhythm: 'half'
        };
        static name = 'cosinus by osci3_period';
        static index = 50;

        apply(key) {
            this.osci.osci3_period = this.settings.osci3_period;
            this.osci.rhythm = this.settings.rhythm;
            return this.activate(key, HC.Osci.wobble(0, this.osci, Math.cos));

        }
    }
}