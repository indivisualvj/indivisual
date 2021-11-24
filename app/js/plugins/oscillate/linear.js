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
            speed = speed || this.beatKeeper.getSpeed('double');
            return this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
        }
    }
}
{
    HC.plugins.oscillate.lininoutdotfivequad = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0.5/1.5 (quad)';
        static index = 60;

        apply(key, speed) {
            speed = speed || this.beatKeeper.getSpeed('quad');
            return this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
        }
    }
}
{
    HC.plugins.oscillate.lininoutdotfiveocta = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0.5/1.5 (octa)';
        static index = 60;

        apply(key, speed) {
            speed = speed || this.beatKeeper.getSpeed('octa');
            return this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
        }
    }
}
{
    HC.plugins.oscillate.lininoutdotfivehexa = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0.5/1.5 (hexa)';
        static index = 60;

        apply(key, speed) {
            speed = speed || this.beatKeeper.getSpeed('hexa');
            return this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
        }
    }
}
