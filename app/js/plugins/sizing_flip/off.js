HC.plugins.sizing_flip.off = _class(false, HC.ShapeTransformPlugin, {
    index: 1, // hast to be first @see HC.plugins.sizing_flip.random
    name: 'off',

    apply(shape) {
        var layer = this.layer;
        shape.flip(1, 1, 1);
    }
});
