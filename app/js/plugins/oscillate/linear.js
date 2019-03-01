HC.plugins.oscillate.lininout = _class(false, HC.OscillatePlugin, {
    name: 'linear 0/1 (current)',
    index: 60,
    apply(key, speed, add) {
        speed = speed || this.layer.getCurrentSpeed();
        var prc = HC.Osci.linInOut(speed.prc, add);
        this.activate(key, prc);
    }
});

HC.plugins.oscillate.lininoutdotfive = _class(false, HC.OscillatePlugin, {
    name: 'linear 0.5/1.5 (current)',
    index: 60,
    apply(key, speed) {
        speed = speed || this.layer.getCurrentSpeed();
        this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
    }
});

HC.plugins.oscillate.lininoutdotfivedouble = _class(false, HC.OscillatePlugin, {
    name: 'linear 0.5/1.5 (double)',
    index: 60,
    apply(key, speed) {
        speed = speed || beatkeeper.getSpeed('double');
        this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
    }
});

HC.plugins.oscillate.lininoutdotfivequad = _class(false, HC.OscillatePlugin, {
    name: 'linear 0.5/1.5 (quad)',
    index: 60,
    apply(key, speed) {
        speed = speed || beatkeeper.getSpeed('quad');
        this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
    }
});

HC.plugins.oscillate.lininoutdotfiveocta = _class(false, HC.OscillatePlugin, {
    name: 'linear 0.5/1.5 (octa)',
    index: 60,
    apply(key, speed) {
        speed = speed || beatkeeper.getSpeed('octa');
        this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
    }
});

HC.plugins.oscillate.lininoutdotfivehexa = _class(false, HC.OscillatePlugin, {
    name: 'linear 0.5/1.5 (hexa)',
    index: 60,
    apply(key, speed) {
        speed = speed || beatkeeper.getSpeed('hexa');
        this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
    }
});