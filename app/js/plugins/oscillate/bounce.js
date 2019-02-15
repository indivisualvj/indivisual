HC.plugins.oscillate.bounce = _class(
    function () {
        this.preset = 1;
    }, HC.OscillatePlugin, {
        name: 'bounce 0 to 1 (current)',
        apply: function (key) {
            var layer = this.layer;
            var speed = layer.getCurrentSpeed();
            var prc = (speed.prc - 0.5);
            this.activate(key, Math.pow(prc, 2) * 4);
        }
    }
);

HC.plugins.oscillate.bounceminusfulls = _class(
    function () {
        this.preset = 1;
    }, HC.OscillatePlugin, {
        name: 'bounce -1 to 1 on fulls',
        apply: function (key) {
            var layer = this.layer;
            var pa = this.params(key);
            var speed = layer.getCurrentSpeed();

            // eher xing als bounce
            // var progress = speed.prc - .5;
            // progress = Math.pow(progress, 2) * 4;
            // progress = Math.max(0, 1 - progress) * pa;
            // this.activate(key, progress);

            var prc = (speed.prc - 0.5);
            var v = Math.pow(prc, 2) * 4 * pa;
            this.activate(key, v);

            if (round(v, 1) == 0) {
                pa *= -1;
                this.params(key, pa);
            }
        }
    });