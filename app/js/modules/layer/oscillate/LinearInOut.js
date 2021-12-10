/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OscillatePlugin} from "../OscillatePlugin";

class lininout extends OscillatePlugin {
        static name = 'linear 0/1 (current)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.layer.currentSpeed();
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }


    class lininouthexa extends OscillatePlugin {
        static name = 'linear 0/1 (hexa)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.beatKeeper.getSpeed('hexa');
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }


    class lininoutocta extends OscillatePlugin {
        static name = 'linear 0/1 (octa)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.beatKeeper.getSpeed('octa');
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }


    class lininoutquad extends OscillatePlugin {
        static name = 'linear 0/1 (quad)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.beatKeeper.getSpeed('quad');
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }


    class lininoutdouble extends OscillatePlugin {
        static name = 'linear 0/1 (double)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.beatKeeper.getSpeed('double');
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }


    class lininoutfull extends OscillatePlugin {
        static name = 'linear 0/1 (full)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.beatKeeper.getSpeed('full');
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }


    class lininouthalf extends OscillatePlugin {
        static name = 'linear 0/1 (half)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.beatKeeper.getSpeed('half');
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }


    class lininoutquarter extends OscillatePlugin {
        static name = 'linear 0/1 (quarter)';
        static index = 60;

        apply(key, speed, add) {
            speed = speed || this.beatKeeper.getSpeed('quarter');
            let prc = HC.Osci.linInOut(speed.prc, add);
            return this.activate(key, prc);
        }
    }

export {lininoutdouble, lininoutfull, lininouthalf, lininoutquarter, lininouthexa, lininoutocta, lininoutquad, lininout};
