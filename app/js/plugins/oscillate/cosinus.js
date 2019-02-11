HC.plugins.oscillate.cosinus = _class(false, HC.OscillatePlugin, {
    name: 'cosinus -1/1 (current)',
    apply: function (key) {
        var layer = this.layer;
        var speed = layer.getCurrentSpeed();
        this.activate(key, HC.Osci.cosinus(speed.prc));
    }
});

HC.plugins.oscillate.cosinout = _class(false, HC.OscillatePlugin, {
    name: 'cosinus 0/1 (current)',

    apply: function (key) {
        var layer = this.layer;
        var speed = layer.getCurrentSpeed();
        this.activate(key, HC.Osci.cosInOut(speed.prc));
    }
});

HC.plugins.oscillate.cosinouthexa = _class(false, HC.OscillatePlugin, {
    name: 'cosinus 0/1 (hexa)',

    apply: function (key) {
        var speed = beatkeeper.getSpeed('hexa');
        this.activate(key, HC.Osci.cosInOut(speed.prc));
    }
});

HC.plugins.oscillate.cosinoutdotfivehexa = _class(false, HC.OscillatePlugin, {
    name: 'cosinus 0.5/1.5 (hexa)',

    apply: function (key) {
        var speed = beatkeeper.getSpeed('hexa');
        this.activate(key, HC.Osci.cosInOut(speed.prc, .5));
    }
});

HC.plugins.oscillate.cosinoutdotfive32 = _class(false, HC.OscillatePlugin, {
    name: 'cosinus 0.5/1.5 (32)',

    apply: function (key) {
        var speed = beatkeeper.getSpeed('32');
        this.activate(key, HC.Osci.cosInOut(speed.prc, .5));
    }
});

HC.plugins.oscillate.cosinusfulls = _class(false, HC.OscillatePlugin, {
    name: 'cosinus -1/1 (fulls)',

    apply: function (key) {
        var speed = beatkeeper.getSpeed('full');
        this.activate(key, HC.Osci.cosinus(speed.prc));
    }
});

HC.plugins.oscillate.oscillator = _class(false, HC.OscillatePlugin, {
    name: 'oscillate',

    apply: function (key) {
        this.activate(key, HC.Osci.wobble(0, this.settings));
    }
});

HC.plugins.oscillate.cosinusosci1 = _class(
    function () {
        this.osci = {
            osci1_period: 1,
            osci1_amp: 1,
            osci2_period: 0,
            osci2_amp: 0,
            osci3_period: 0,
            osci3_amp: 0,
            rhythm: 'half'
        };
    }, HC.OscillatePlugin, {
        name: 'cosinus by osci1_period',
        apply: function (key) {
            this.osci.osci1_period = this.settings.osci1_period;
            this.osci.rhythm = this.settings.rhythm;
            this.activate(key, HC.Osci.wobble(0, this.osci, Math.cos));

        }
    }
);

HC.plugins.oscillate.cosinusosci2 = _class(
    function () {
        this.osci = {
            osci1_period: 0,
            osci1_amp: 0,
            osci2_period: 1,
            osci2_amp: 1,
            osci3_period: 0,
            osci3_amp: 0,
            rhythm: 'half'
        };
    }, HC.OscillatePlugin, {
        name: 'cosinus by osci2_period',
        apply: function (key) {
            var layer = this.layer;
            this.osci.osci2_period = this.settings.osci2_period;
            this.osci.rhythm = this.settings.rhythm;
            this.activate(key, HC.Osci.wobble(0, this.osci, Math.cos));

        }
    }
);

HC.plugins.oscillate.cosinusosci3 = _class(
    function () {
        this.osci = {
            osci1_period: 0,
            osci1_amp: 0,
            osci2_period: 0,
            osci2_amp: 0,
            osci3_period: 1,
            osci3_amp: 1,
            rhythm: 'half'
        };
    }, HC.OscillatePlugin, {
        name: 'cosinus by osci3_period',
        apply: function (key) {
            var layer = this.layer;
            this.osci.osci3_period = this.settings.osci3_period;
            this.osci.rhythm = this.settings.rhythm;
            this.activate(key, HC.Osci.wobble(0, this.osci, Math.cos));

        }
    }
);