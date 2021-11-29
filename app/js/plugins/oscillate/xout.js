{
    HC.plugins.oscillate.appearlinout = class Plugin extends HC.OscillatePlugin {
        static name = 'appear & linout';

        apply(key) {
            let layer = this.layer;
            let speed = layer.currentSpeed();
            return this.activate(key, 1 - speed.prc);
        }
    }
}
{
    HC.plugins.oscillate.appearexpout = class Plugin extends HC.OscillatePlugin {
        static name = 'appear & expout';

        apply(key) {
            let layer = this.layer;
            let speed = layer.currentSpeed();
            return this.activate(key, Math.pow(1 - speed.prc, 2));
        }
    }
}
{
    HC.plugins.oscillate.appearlogout = class Plugin extends HC.OscillatePlugin {
        static name = 'appear & logout';

        apply(key) {
            let layer = this.layer;
            let speed = layer.currentSpeed();
            return this.activate(key, Math.sqrt(1 - speed.prc));
        }
    }
}