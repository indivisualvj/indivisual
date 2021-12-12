/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MaterialStylePlugin} from "../MaterialStylePlugin";

class fill extends MaterialStylePlugin {
    static index = 1;
    static name = 'fill';

    apply(shape) {
        let params = this.params(shape);
        params.stroke = false;
    }
}


class stroke extends MaterialStylePlugin {
    static name = 'stroke';

    apply(shape) {
        let params = this.params(shape);
        params.stroke = true;
    }
}


class peak extends MaterialStylePlugin {
    static name = 'switch on peak';
    state = false;

    apply(shape) {
        if (this.isFirstShape(shape)) {
            if (this.audioAnalyser.peak && randomBool()) {
                this.state = !this.state;
            }
        }

        let params = this.params(shape);
        params.stroke = this.state;
    }
}

export {fill, peak, stroke};
