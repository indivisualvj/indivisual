{
    HC.plugins.oscillate.expindisappear = class Plugin extends HC.OscillatePlugin {
        static name = 'expin & disappear';

        apply(key) {
            let layer = this.layer;
            let speed = layer.getCurrentSpeed();
            return this.activate(key, Math.pow(speed.prc, 2));
        }
    }
}
{
    HC.plugins.oscillate.logindisappear = class Plugin extends HC.OscillatePlugin {
        static name = 'login & disappear';

        apply(key) {
            let layer = this.layer;
            let speed = layer.getCurrentSpeed();
            return this.activate(key, Math.sqrt(speed.prc));
        }
    }
}
{
    HC.plugins.oscillate.linindisappear = class Plugin extends HC.OscillatePlugin {
        static name = 'linin & disappear';

        apply(key) {
            let layer = this.layer;
            let speed = layer.getCurrentSpeed();
            return this.activate(key, speed.prc);
        }
    }
}