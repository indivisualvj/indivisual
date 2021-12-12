import {SizingFlipPlugin} from "../SizingFlipPlugin";

class randompeak extends SizingFlipPlugin {
    static index = 3;

    apply(shape) {
        let layer = this.layer;

        layer.getSizingFlipPlugin('random').apply(shape, this.audioAnalyser.peak && randomBool());
    }
}


class random extends SizingFlipPlugin {
    static index = 2;
    injections = {mode: false};

    apply(shape, overwrite) {
        let layer = this.layer;

        let params = this.params(shape);

        if (!params.mode || overwrite) {
            let keys = Object.keys(this.config.AnimationValues.sizing_flip);
            params.mode = keys[randomInt(3, keys.length - 1)]; // first means off, last two have to be random and randompeak

        }
        layer.getSizingFlipPlugin(params.mode).apply(shape);
    }
}

export {random, randompeak};
