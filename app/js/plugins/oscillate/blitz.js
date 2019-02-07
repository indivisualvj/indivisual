HC.plugins.oscillate.blitzpeak = _class(false, HC.OscillatePlugin, {
    name: 'blitz (peak)',
    apply: function (key) {
        var pa = this.params(key);

        if (pa > 0) {
            pa = Math.max(0, pa - (1 / animation.diff) * 2.6);

        } else if (audio.peak) {
            pa = (pa ? 0 : 1);
        }

        this.params(key, pa);
        this.activate(key, pa);
    }
});

HC.plugins.oscillate.blitzpeakslow = _class(false, HC.OscillatePlugin, {
    name: 'blitz (peak/slow)',

    apply: function (key) {
        var layer = this.layer;
        var pa = this.params(key);

        if (pa > 0) {
            pa = Math.max(0, pa - (1 / animation.diff) * 1.1);

        } else if (audio.peak) {
            pa = (pa ? 0 : 1);
        }

        this.params(key, pa);
        this.activate(key, pa);
    }
});

HC.plugins.oscillate.blitzfull = _class(false, HC.OscillatePlugin, {
    name: 'blitz (full)',

    apply: function (key) {
        var layer = this.layer;
        var pa = this.params(key);

        var speed = beatkeeper.getSpeed('full');

        if (pa > 0) {
            pa = Math.max(0, pa - (1 / animation.diff) * 0.65);

        } else if (speed.prc == 0) {
            pa = (pa ? 0 : 1);
        }

        this.params(key, pa);
        this.activate(key, pa);
    }
});

HC.plugins.oscillate.blitzhalf = _class(false, HC.OscillatePlugin, {
    name: 'blitz (half)',

    apply: function (key) {
        var layer = this.layer;
        var pa = this.params(key);

        var speed = beatkeeper.getSpeed('half');

        if (pa > 0) {
            pa = Math.max(0, pa - (1 / animation.diff) * 0.65);

        } else if (speed.prc == 0) {
            pa = (pa ? 0 : 1);
        }

        this.params(key, pa);
        this.activate(key, pa);
    }
});

HC.plugins.oscillate.blitzquarter = _class(false, HC.OscillatePlugin, {
    name: 'blitz (quarter)',

    apply: function (key) {
        var layer = this.layer;
        var pa = this.params(key);

        var speed = beatkeeper.getSpeed('quarter');

        if (pa > 0) {
            pa = Math.max(0, pa - (1 / animation.diff) * 1.3);

        } else if (speed.prc == 0) {
            pa = (pa ? 0 : 1);
        }

        this.params(key, pa);
        this.activate(key, pa);
    }
});

HC.plugins.oscillate.blitzeight = _class(false, HC.OscillatePlugin, {
    name: 'blitz (eight)',

    apply: function (key) {
        var layer = this.layer;
        var pa = this.params(key);

        var speed = beatkeeper.getSpeed('eight');

        if (pa > 0) {
            pa = Math.max(0, pa - (1 / animation.diff) * 2.6);

        } else if (speed.prc == 0) {
            pa = (pa ? 0 : 1);
        }

        this.params(key, pa);
        this.activate(key, pa);
    }
});
