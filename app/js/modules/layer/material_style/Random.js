/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {MaterialStylePlugin} from "../MaterialStylePlugin";

class random extends MaterialStylePlugin {
        static name = 'random';
        injections = {
            state: undefined
        };

        apply(shape) {
            let pa = this.params(shape);
            if (pa.state === undefined) {
                pa.state = randomBool();
            }

            let params = this.params(shape);
            params.stroke = pa.state;
        }
    }


class randompeak extends MaterialStylePlugin {
        static name = 'random on peak';
        injections = {
            state: undefined
        };

        apply(shape) {
            let pa = this.params(shape);
            if (pa.state === undefined || (this.audioAnalyser.peak && randomBool())) {
                pa.state = randomBool();
            }

            let params = this.params(shape);
            params.stroke = pa.state;
        }
    }

export {randompeak, random};
