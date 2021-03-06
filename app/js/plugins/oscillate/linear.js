{
    HC.plugins.oscillate.lininout = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0/1 (current)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.layer.getCurrentSpeed();
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }
}
{
    HC.plugins.oscillate.lininoutdotfive = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0.5/1.5 (current)';
        static index = 60;

        apply(key, speed) {
            speed = speed || this.layer.getCurrentSpeed();
            return this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
        }
    }
}
{
    HC.plugins.oscillate.lininoutdotfivedouble = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0.5/1.5 (double)';
        static index = 60;

        apply(key, speed) {
            speed = speed || beatkeeper.getSpeed('double');
            return this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
        }
    }
}
{
    HC.plugins.oscillate.lininoutdotfivequad = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0.5/1.5 (quad)';
        static index = 60;

        apply(key, speed) {
            speed = speed || beatkeeper.getSpeed('quad');
            return this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
        }
    }
}
{
    HC.plugins.oscillate.lininoutdotfiveocta = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0.5/1.5 (octa)';
        static index = 60;

        apply(key, speed) {
            speed = speed || beatkeeper.getSpeed('octa');
            return this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
        }
    }
}
{
    HC.plugins.oscillate.lininoutdotfivehexa = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0.5/1.5 (hexa)';
        static index = 60;

        apply(key, speed) {
            speed = speed || beatkeeper.getSpeed('hexa');
            return this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
        }
    }
}