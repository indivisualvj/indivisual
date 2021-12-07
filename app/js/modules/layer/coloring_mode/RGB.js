/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ColoringModePlugin} from "../ColoringModePlugin";

class onergb extends ColoringModePlugin {
    static name = 'one RGB';
    static index = 12;

    apply(shape) {
        if (this.isFirstShape(shape)) {

            let prc = (this.animation.now - this.beatKeeper.beatStartTime) / (60000 / this.config.ControlSettings.tempo) / 100 * this.settings.coloring_volume;
            prc = HC.Osci.sinInOut(prc) * 5;

            prc *= RAD * 180 * this.settings.coloring_volume;

            let r = (Math.sin(prc) / 2 + 0.5) * 255;
            let g = (Math.sin(prc + 60 * RAD) / 2 + 0.5) * 255;
            let b = (Math.sin(prc + 120 * RAD) / 2 + 0.5) * 255;

            this.color = rgbToHsl({r: r, g: g, b: b});
        }

        copyHsl(this.color, shape.color);
    }

}


class floatrgb extends ColoringModePlugin {
    static name = 'float RGB';

    apply(shape) {
        this.layer.getColoringModePlugin('reactivergb').apply(shape, false, false);
    }
}


class floatrgbc extends ColoringModePlugin {
    static name = 'float RGB center';

    apply(shape) {
        this.layer.getColoringModePlugin('reactivergb').apply(shape, false, true);
    }
}


class growrgb extends ColoringModePlugin {

    static name = 'grow RGB';

    apply(shape) {
        this.layer.getColoringModePlugin('reactivergb').apply(shape, false, false, true);
    }
}

export {floatrgb, floatrgbc, growrgb, onergb};
