{
    HC.plugins.oscillate.lininout = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0/1 (current)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.layer.currentSpeed();
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }
}
{
    HC.plugins.oscillate.lininouthexa = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0/1 (hexa)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.beatKeeper.getSpeed('hexa');
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }
}
{
    HC.plugins.oscillate.lininoutocta = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0/1 (octa)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.beatKeeper.getSpeed('octa');
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }
}
{
    HC.plugins.oscillate.lininoutquad = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0/1 (quad)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.beatKeeper.getSpeed('quad');
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }
}
{
    HC.plugins.oscillate.lininoutdouble = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0/1 (double)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.beatKeeper.getSpeed('double');
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }
}
{
    HC.plugins.oscillate.lininoutfull = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0/1 (full)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.beatKeeper.getSpeed('full');
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }
}
{
    HC.plugins.oscillate.lininouthalf = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0/1 (half)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.beatKeeper.getSpeed('half');
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }
}
{
    HC.plugins.oscillate.lininoutquarter = class Plugin extends HC.OscillatePlugin {
        static name = 'linear 0/1 (quarter)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.beatKeeper.getSpeed('quarter');
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }
}