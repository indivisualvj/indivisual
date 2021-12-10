/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OscillatePlugin} from "../OscillatePlugin";

class fourstep extends OscillatePlugin {
        static name = 'fourstep 0/1 on peak';
        static index = 30;
        preset = {value: 1, next: 1};

        apply(key) {
            let pa = this.params(key);
            HC.Osci.step(pa, 4, this.beatKeeper.getSpeed('full'), true, false, this.audioAnalyser.peak, this.animation.diff);
            return this.activate(key, pa.value);
        }
    }


    class fourstepfulls extends OscillatePlugin {
        static name = 'fourstep 0/1 on fulls';
        static index = 30;
        preset = {value: 1, next: 1};

        apply(key) {
            let pa = this.params(key);
            HC.Osci.step(pa, 4, this.beatKeeper.getSpeed('full'), false, false, this.audioAnalyser.peak, this.animation.diff);
            return this.activate(key, pa.value);
        }
    }


    class fourstepminus extends OscillatePlugin {
        preset = {value: 1, next: 1};
        static name = 'fourstep -1/1 on peak';
        static index = 30;

        apply(key) {
            let pa = this.params(key);
            HC.Osci.step(pa, 4, this.beatKeeper.getSpeed('full'), true, true, this.audioAnalyser.peak, this.animation.diff);
            return this.activate(key, pa.value);
        }
    }


    class fourstephalfsminus extends OscillatePlugin {
        static name = 'fourstep -1/1 on halfs';
        static index = 30;
        preset = {value: 1, next: 1};

        apply(key) {
            let pa = this.params(key);
            HC.Osci.step(pa, 4, this.beatKeeper.getSpeed('half'), false, true, this.audioAnalyser.peak, this.animation.diff);
            return this.activate(key, pa.value);
        }
    }


    class fourstepfullsminus extends OscillatePlugin {
        static name = 'fourstep -1/1 on fulls';
        static index = 30;
        preset = {value: 1, next: 1};

        apply(key) {
            let pa = this.params(key);
            HC.Osci.step(pa, 4, this.beatKeeper.getSpeed('full'), false, true, this.audioAnalyser.peak, this.animation.diff);
            return this.activate(key, pa.value);
        }
    }

export {fourstepfullsminus, fourstepfulls, fourstephalfsminus, fourstepminus, fourstep};
