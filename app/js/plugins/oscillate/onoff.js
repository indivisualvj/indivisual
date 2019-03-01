HC.plugins.oscillate.onoffpeak = _class(false, HC.OscillatePlugin, {
    name: 'on & off (peak)',
    index: 80,
    apply(key) {
        var layer = this.layer;
        var pa = this.params(key);

        if (audio.peak) {
            pa = (pa ? 0 : 1);
        }

        this.params(key, pa);
        this.activate(key, pa);
    }
});

HC.plugins.oscillate.onoffhalf = _class(false, HC.OscillatePlugin, {
    name: 'on & off (half)',
    index: 80,
    apply(key) {
        var layer = this.layer;
        var pa = this.params(key);

        var speed = beatkeeper.getSpeed('half');
        if (speed.prc == 0) {
            pa = (pa ? 0 : 1);
        }

        this.params(key, pa);
        this.activate(key, pa);
    }
});

HC.plugins.oscillate.onofffull = _class(false, HC.OscillatePlugin, {
    name: 'on & off (full)',
    index: 80,
    apply(key) {
        var layer = this.layer;
        var pa = this.params(key);

        var speed = beatkeeper.getSpeed('full');
        if (speed.prc == 0) {
            pa = (pa ? 0 : 1);
        }

        this.params(key, pa);
        this.activate(key, pa);
    }
});

HC.plugins.oscillate.onoffdouble = _class(false, HC.OscillatePlugin, {
    name: 'on & off (double)',
    index: 80,
    apply(key) {
        var layer = this.layer;
        var pa = this.params(key);

        var speed = beatkeeper.getSpeed('double');
        if (speed.prc == 0) {
            pa = (pa ? 0 : 1);
        }

        this.params(key, pa);
        this.activate(key, pa);
    }
});

HC.plugins.oscillate.onoffquarter = _class(false, HC.OscillatePlugin, {
    name: 'on & off (quarter)',
    index: 80,
    apply(key) {
        var layer = this.layer;
        var pa = this.params(key);

        var speed = beatkeeper.getSpeed('quarter');
        if (speed.prc == 0) {
            pa = (pa ? 0 : 1);
        }

        this.params(key, pa);
        this.activate(key, pa);
    }
});