HC.plugins.shape_modifier.off = _class(false, HC.ShapeModifierPlugin, {
    index: 1,
    name: 'off',

    create: function (geometry) {
        return geometry;
    }
});