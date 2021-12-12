/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {OscillatePlugin} from "../OscillatePlugin";

class expindisappear extends OscillatePlugin {
    static name = 'expin & disappear';

    apply(key) {
        let layer = this.layer;
        let speed = layer.currentSpeed();
        return this.activate(key, Math.pow(speed.prc, 2));
    }
}


class logindisappear extends OscillatePlugin {
    static name = 'login & disappear';

    apply(key) {
        let layer = this.layer;
        let speed = layer.currentSpeed();
        return this.activate(key, Math.sqrt(speed.prc));
    }
}


class linindisappear extends OscillatePlugin {
    static name = 'linin & disappear';

    apply(key) {
        let layer = this.layer;
        let speed = layer.currentSpeed();
        return this.activate(key, speed.prc);
    }
}

export {expindisappear, linindisappear, logindisappear};
