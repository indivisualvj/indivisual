HC.plugins.sizing_flip.randompeak = _class(false, HC.SizingFlipPlugin, {
    index: 3,
    apply: function (shape) {
        var layer = this.layer;

        layer.getSizingFlipPlugin('random').apply(shape, audio.peak && randomBool());
    }
});

HC.plugins.sizing_flip.random = _class(false, HC.SizingFlipPlugin, {
    index: 2,
    injections: {mode: false},
    apply: function (shape, overwrite) {
        var layer = this.layer;

        var params = this.params(shape);

        if (!params.mode || overwrite) {
            var keys = Object.keys(statics.AnimationValues.sizing_flip);
            params.mode = keys[randomInt(3, keys.length - 1)]; // first means off, last two have to be random and randompeak

        }
        layer.getSizingFlipPlugin(params.mode).apply(shape);
    }
});
