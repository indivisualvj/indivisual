/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OscillatePlugin} from "../OscillatePlugin";

class lininoutdotfive extends OscillatePlugin {
        static name = 'linear 0.5/1.5 (current)';
        static index = 60;

        apply(key, speed) {
            speed = speed || this.layer.currentSpeed();
            return this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
        }
    }


    class lininoutdotfivedouble extends OscillatePlugin {
        static name = 'linear 0.5/1.5 (double)';
        static index = 60;

        apply(key, speed) {
            speed = speed || this.beatKeeper.getSpeed('double');
            return this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
        }
    }


    class lininoutdotfivequad extends OscillatePlugin {
        static name = 'linear 0.5/1.5 (quad)';
        static index = 60;

        apply(key, speed) {
            speed = speed || this.beatKeeper.getSpeed('quad');
            return this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
        }
    }


    class lininoutdotfiveocta extends OscillatePlugin {
        static name = 'linear 0.5/1.5 (octa)';
        static index = 60;

        apply(key, speed) {
            speed = speed || this.beatKeeper.getSpeed('octa');
            return this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
        }
    }


    class lininoutdotfivehexa extends OscillatePlugin {
        static name = 'linear 0.5/1.5 (hexa)';
        static index = 60;

        apply(key, speed) {
            speed = speed || this.beatKeeper.getSpeed('hexa');
            return this.layer.getOscillatePlugin('lininout').apply(key, speed, .5);
        }
    }

export {lininoutdotfivedouble, lininoutdotfivehexa, lininoutdotfiveocta, lininoutdotfivequad, lininoutdotfive};
