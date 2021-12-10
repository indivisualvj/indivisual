/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OscillatePlugin} from "../OscillatePlugin";

class incremental extends OscillatePlugin {
    static name = 'incremental';
    static index = 10;

    apply(key) {
        let v = this.params(key);

        v += 0.02 * this.animation.diffPrc;
        this.params(key, v);
        return this.activate(key, v);
    }
}


class incrementalpeak extends OscillatePlugin {
    static name = 'incremental (race on peak)';
    static index = 10;
    preset = {velocity: 1, progress: 0};

    apply(key) {
        let pa = this.params(key);
        if (this.audioAnalyser.peak && pa.velocity < 3) {
            pa.velocity = 4;

        } else if (pa.velocity > 1) {
            pa.velocity = Math.max(1, pa.velocity - this.animation.diff * 0.02);
        }

        pa.progress += 0.02 * pa.velocity;
        return this.activate(key, pa.progress);
    }
}

export {incrementalpeak, incremental};
