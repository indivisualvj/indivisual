{
    HC.plugins.oscillate.blitzpeak = class Plugin extends HC.OscillatePlugin {
        static name = 'blitz (peak)';
        static index = 70;

        apply(key) {
            let pa = this.params(key);

            if (pa > 0) {
                pa = Math.max(0, pa - (1 / animation.diff) * 2.6);

            } else if (audio.peak) {
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
                pa = Math.max(0, pa - (1 / animation.diff) * 1.1);

            } else if (audio.peak) {
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

            let speed = beatkeeper.getSpeed('full');

            if (pa > 0) {
                pa = Math.max(0, pa - (1 / animation.diff) * 0.65);

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

            let speed = beatkeeper.getSpeed('half');

            if (pa > 0) {
                pa = Math.max(0, pa - (1 / animation.diff) * 0.65);

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
            // todo plugins should have owners also -> this.owner.beatkeeper
            let speed = beatkeeper.getSpeed('quarter');

            if (pa > 0) {
                pa = Math.max(0, pa - (1 / animation.diff) * 1.3);

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

            let speed = beatkeeper.getSpeed('eight');

            if (pa > 0) {
                pa = Math.max(0, pa - (1 / animation.diff) * 2.6);

            } else if (speed.prc == 0) {
                pa = (pa ? 0 : 1);
            }

            this.params(key, pa);
            return this.activate(key, pa);
        }
    }
}
