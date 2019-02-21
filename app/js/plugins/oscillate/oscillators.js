HC.plugins.oscillate.timestamp = _class(false, HC.OscillatePlugin, {
    name: 'timestamp',
    index: 10,
    apply: function (key) {
        this.activate(key, (animation.now - beatkeeper.beatStartTime) / (60000 / statics.ControlSettings.tempo));
    }
});

HC.plugins.oscillate.incremental = _class(false, HC.OscillatePlugin, {
    name: 'incremental',
    index: 10,
    apply: function (key) {
        var v = this.params(key);

        v += 0.02;
        this.params(key, v);
        this.activate(key, v);
    }
});

HC.plugins.oscillate.incrementalpeak = _class(
    function () {
        this.preset = {velocity: 1, progress: 0};
    }, HC.OscillatePlugin, {
        name: 'incremental (race on peak)',
        index: 10,
        apply: function (key) {
            var pa = this.params(key);
            if (audio.peak && pa.velocity < 3) {
                pa.velocity = 4;

            } else if (pa.velocity > 1) {
                pa.velocity = Math.max(1, pa.velocity - animation.diff * 0.02);
            }

            pa.progress += 0.02 * pa.velocity;
            this.activate(key, pa.progress);
        }
    }
);

HC.plugins.oscillate.audio = _class(false, HC.OscillatePlugin, {
    name: 'audio',
    index: 10,
    apply: function (key) {
        this.activate(key, Math.min(1, 2.5 * audio.volume));
    }
});
