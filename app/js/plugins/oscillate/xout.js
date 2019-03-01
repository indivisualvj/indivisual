HC.plugins.oscillate.appearlinout = _class(false, HC.OscillatePlugin, {
    name: 'appear & linout',
    apply(key) {
        var layer = this.layer;
        var speed = layer.getCurrentSpeed();
        this.activate(key, 1 - speed.prc);
    }
});

HC.plugins.oscillate.appearexpout = _class(false, HC.OscillatePlugin, {
    name: 'appear & expout',
    apply(key) {
        var layer = this.layer;
        var speed = layer.getCurrentSpeed();
        this.activate(key, Math.pow(1 - speed.prc, 2));
    }
});

HC.plugins.oscillate.appearlogout = _class(false, HC.OscillatePlugin, {
    name: 'appear & logout',
    apply(key) {
        var layer = this.layer;
        var speed = layer.getCurrentSpeed();
        this.activate(key, Math.sqrt(1 - speed.prc));
    }
});