{
    HC.plugins.oscillate.onoffpeak = class Plugin extends HC.OscillatePlugin {
        static name = 'on & off (peak)';
        static index = 80;

        apply(key) {
            let layer = this.layer;
            let pa = this.params(key);

            if (this.audioAnalyser.peak) {
                pa = (pa ? 0 : 1);
            }

            this.params(key, pa);
            return this.activate(key, pa);
        }
    }
}
{
    HC.plugins.oscillate.onoffhalf = class Plugin extends HC.OscillatePlugin {
        static name = 'on & off (half)';
        static index = 80;

        apply(key) {
            let layer = this.layer;
            let pa = this.params(key);

            let speed = this.beatKeeper.getSpeed('half');
            if (speed.prc == 0) {
                pa = (pa ? 0 : 1);
            }

            this.params(key, pa);
            return this.activate(key, pa);
        }
    }
}
{
    HC.plugins.oscillate.onofffull = class Plugin extends HC.OscillatePlugin {
        static name = 'on & off (full)';
        static index = 80;

        apply(key) {
            let layer = this.layer;
            let pa = this.params(key);

            let speed = this.beatKeeper.getSpeed('full');
            if (speed.prc == 0) {
                pa = (pa ? 0 : 1);
            }

            this.params(key, pa);
            return this.activate(key, pa);
        }
    }
}
{
    HC.plugins.oscillate.onoffdouble = class Plugin extends HC.OscillatePlugin {
        static name = 'on & off (double)';
        static index = 80;

        apply(key) {
            let layer = this.layer;
            let pa = this.params(key);

            let speed = this.beatKeeper.getSpeed('double');
            if (speed.prc == 0) {
                pa = (pa ? 0 : 1);
            }

            this.params(key, pa);
            return this.activate(key, pa);
        }
    }
}
{
    HC.plugins.oscillate.onoffquarter = class Plugin extends HC.OscillatePlugin {
        static name = 'on & off (quarter)';
        static index = 80;

        apply(key) {
            let layer = this.layer;
            let pa = this.params(key);

            let speed = this.beatKeeper.getSpeed('quarter');
            if (speed.prc == 0) {
                pa = (pa ? 0 : 1);
            }

            this.params(key, pa);
            return this.activate(key, pa);
        }
    }
}
