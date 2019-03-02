{
    HC.plugins.sizing_flip.randompeak = class Plugin extends HC.SizingFlipPlugin {
        static index = 3;

        apply(shape) {
            let layer = this.layer;

            layer.getSizingFlipPlugin('random').apply(shape, audio.peak && randomBool());
        }
    }
}
{
    HC.plugins.sizing_flip.random = class Plugin extends HC.SizingFlipPlugin {
        static index = 2;
        injections = {mode: false};

        apply(shape, overwrite) {
            let layer = this.layer;

            let params = this.params(shape);

            if (!params.mode || overwrite) {
                let keys = Object.keys(statics.AnimationValues.sizing_flip);
                params.mode = keys[randomInt(3, keys.length - 1)]; // first means off, last two have to be random and randompeak

            }
            layer.getSizingFlipPlugin(params.mode).apply(shape);
        }
    }
}