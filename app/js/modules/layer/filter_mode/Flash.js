/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {FilterModePlugin} from "../FilterModePlugin";

class flash extends FilterModePlugin {

    color;

    apply(shape, overwrite) {
        let layer = this.layer;

        if (!this.color) {
            this.color = randomColor();
        }
        let color = this.color;

        if (this.isFirstShape(shape) || overwrite === true) {
            let speed = layer.shapeSpeed(shape);

            if (speed.progress > speed.duration - 50) {
                let diff = Math.abs(speed.duration - speed.progress);

                color.s += (diff * 2) * this.settings.filter_volume;
                if (color.s > 100) {
                    color.s -= 20 * this.settings.filter_volume;
                }

                color.l += (diff * 2) * this.settings.filter_volume;
                if (color.l > 100) {
                    color.l -= 20;
                }

            } else if (speed.progress < 100) {

                color.s -= (speed.progress / 2) * this.settings.filter_volume;
                if (color.s < 40) {
                    color.s += 10;
                }

                color.l -= (speed.progress / 2) * this.settings.filter_volume;
                if (color.l < 40) {
                    color.l += 10;
                }

            } else {

                if (color.s < 40) {
                    color.s += 10;
                }
                if (color.l < 40) {
                    color.l += 10;
                }
            }
        }

        shape.color.s = color.s;
        shape.color.l = color.l;
    }
}

class strobe extends FilterModePlugin {

    color;

    apply(shape, overwrite) {
        let layer = this.layer;

        if (!this.color) {
            this.color = randomColor();
        }

        let color = this.color;

        if (this.isFirstShape(shape) || overwrite === true) {
            let speed = layer.shapeSpeed(shape);

            let pm = randomInt(80, 110);
            if (speed.progress > speed.duration - pm
                || (this.beatKeeper.rhythmSlow(this.settings.rhythm) // rhythmSlow WOOT but that's funky as fuck
                    && speed.progress > speed.duration / 2 - pm
                    && speed.progress < speed.duration / 2)
            ) {
                color.s = 100 * this.settings.filter_volume;
                color.l = 100 * this.settings.filter_volume;

            } else if (speed.progress < pm
                || (this.beatKeeper.rhythmSlow(this.settings.rhythm)
                    && speed.progress < speed.duration / 2 + pm
                    && speed.progress > speed.duration / 2)
            ) {
                color.s -= 10 * this.settings.filter_volume;
                color.l -= 10 * this.settings.filter_volume;

            } else {

                if (color.s < 40) {
                    color.s += 10 * this.settings.filter_volume;
                }
                if (color.l < 40) {
                    color.l += 10 * this.settings.filter_volume;
                }

            }
        }

        shape.color.s = color.s;
        shape.color.l = color.l;
    }
}

export {flash, strobe}