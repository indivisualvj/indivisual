{
    HC.plugins.oscillate.bounce = class Plugin extends HC.OscillatePlugin {
        static name = 'bounce 0 to 1 (current)';
        preset = 1;

        apply(key) {
            let layer = this.layer;
            let speed = layer.getCurrentSpeed();
            let prc = (speed.prc - 0.5);
            return this.activate(key, Math.pow(prc, 2) * 4);
        }
    }
}
{
    HC.plugins.oscillate.bounceminusfulls = class Plugin extends HC.OscillatePlugin {
        static name = 'bounce -1 to 1 on fulls';
        preset = 1;

        apply(key) {
            let layer = this.layer;
            let pa = this.params(key);
            let speed = layer.getCurrentSpeed();

            // more xing than bounce example
            // let progress = speed.prc - .5;
            // progress = Math.pow(progress, 2) * 4;
            // progress = Math.max(0, 1 - progress) * pa;
            // return this.activate(key, progress);

            let prc = (speed.prc - 0.5);
            let v = Math.pow(prc, 2) * 4 * pa;

            if (round(v, 1) === 0) {
                pa *= -1;
                this.params(key, pa);
            }

            return this.activate(key, v);
        }
    }
}