HC.plugins.oscillate.expindisappear = _class(false, HC.OscillatePlugin, {
    name: 'expin & disappear',
    apply: function (key) {
        var layer = this.layer;
        var speed = layer.getCurrentSpeed();
        this.activate(key, Math.pow(speed.prc, 2));
    }
});
HC.plugins.oscillate.logindisappear = _class(false, HC.OscillatePlugin, {
    name: 'login & disappear',
    apply: function (key) {
        var layer = this.layer;
        var speed = layer.getCurrentSpeed();
        this.activate(key, Math.sqrt(speed.prc));
    }
});

HC.plugins.oscillate.linindisappear = _class(false, HC.OscillatePlugin, {
    name: 'linin & disappear',
    apply: function (key) {
        var layer = this.layer;
        var speed = layer.getCurrentSpeed();
        this.activate(key, speed.prc);
    }
});
