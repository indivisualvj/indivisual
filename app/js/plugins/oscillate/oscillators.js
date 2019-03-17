{
    HC.plugins.oscillate.timestamp = class Plugin extends HC.OscillatePlugin {
        static name = 'timestamp';
        static index = 10;

        apply(key) {
            return this.activate(key, (animation.now - beatkeeper.beatStartTime) / (60000 / statics.ControlSettings.tempo));
        }
    }
}
{
    HC.plugins.oscillate.incremental = class Plugin extends HC.OscillatePlugin {
        static name = 'incremental';
        static index = 10;

        apply(key) {
            let v = this.params(key);

            v += 0.02 * animation.diffPrc;
            this.params(key, v);
            return this.activate(key, v);
        }
    }
}
{
    HC.plugins.oscillate.incrementalpeak = class Plugin extends HC.OscillatePlugin {
        static name = 'incremental (race on peak)';
        static index = 10;
        preset = {velocity: 1, progress: 0};

        apply(key) {
            let pa = this.params(key);
            if (audio.peak && pa.velocity < 3) {
                pa.velocity = 4;

            } else if (pa.velocity > 1) {
                pa.velocity = Math.max(1, pa.velocity - animation.diff * 0.02);
            }

            pa.progress += 0.02 * pa.velocity;
            return this.activate(key, pa.progress);
        }
    }
}
{
    HC.plugins.oscillate.audio = class Plugin extends HC.OscillatePlugin {
        static name = 'audio';
        static index = 10;

        apply(key) {
            return this.activate(key, Math.min(1, 2.5 * audio.volume));
        }
    }
}
