{
    HC.plugins.oscillate.blitzpeak = class Plugin extends HC.OscillatePlugin {
        static name = 'blitz (peak)';
        static index = 70;

        apply(key) {
            let pa = this.params(key);

            if (pa > 0) {
                pa = Math.max(0, pa - (1 /this.animation.diff) * 2.6);

            } else if (this.audioAnalyser.peak) {
                pa = (pa ? 0 : 1);
            }

            this.params(key, pa);
            return this.activate(key, pa);
        }
    }
}
{
    HC.plugins.oscillate.blitzpeakslow = class Plugin extends HC.OscillatePlugin {
        static name = 'blitz (peak/slow)';
        static index = 70;

        apply(key) {
            let pa = this.params(key);

            if (pa > 0) {
                pa = Math.max(0, pa - (1 /this.animation.diff) * 1.1);

            } else if (this.audioAnalyser.peak) {
                pa = (pa ? 0 : 1);
            }

            this.params(key, pa);
            return this.activate(key, pa);
        }
    }
}
{
    HC.plugins.oscillate.blitzfull = class Plugin extends HC.OscillatePlugin {
        static name = 'blitz (full)';
        static index = 70;

        apply(key) {
            let pa = this.params(key);

            let speed = this.beatKeeper.getSpeed('full');

            if (pa > 0) {
                pa = Math.max(0, pa - (1 /this.animation.diff) * 0.65);

            } else if (speed.prc == 0) {
                pa = (pa ? 0 : 1);
            }

            this.params(key, pa);
            return this.activate(key, pa);
        }
    }
}
{
    HC.plugins.oscillate.blitzhalf = class Plugin extends HC.OscillatePlugin {
        static name = 'blitz (half)';
        static index = 70;

        apply(key) {
            let pa = this.params(key);

            let speed = this.beatKeeper.getSpeed('half');

            if (pa > 0) {
                pa = Math.max(0, pa - (1 /this.animation.diff) * 0.65);

            } else if (speed.prc == 0) {
                pa = (pa ? 0 : 1);
            }

            this.params(key, pa);
            return this.activate(key, pa);
        }
    }
}
{
    HC.plugins.oscillate.blitzquarter = class Plugin extends HC.OscillatePlugin {
        static name = 'blitz (quarter)';
        static index = 70;

        apply(key) {
            let pa = this.params(key);
            let speed = this.beatKeeper.getSpeed('quarter');

            if (pa > 0) {
                pa = Math.max(0, pa - (1 / this.animation.diff) * 1.3);

            } else if (speed.prc == 0) {
                pa = (pa ? 0 : 1);
            }

            this.params(key, pa);
            return this.activate(key, pa);
        }
    }
}
{
    HC.plugins.oscillate.blitzeight = class Plugin extends HC.OscillatePlugin {
        static name = 'blitz (eight)';
        static index = 70;

        apply(key) {
            let pa = this.params(key);

            let speed = this.beatKeeper.getSpeed('eight');

            if (pa > 0) {
                pa = Math.max(0, pa - (1 / this.animation.diff) * 2.6);

            } else if (speed.prc == 0) {
                pa = (pa ? 0 : 1);
            }

            this.params(key, pa);
            return this.activate(key, pa);
        }
    }
}
