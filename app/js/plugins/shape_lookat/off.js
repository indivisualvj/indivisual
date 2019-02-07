HC.plugins.shape_lookat.off = _class(false, HC.ShapeLookatPlugin, {
    apply: function (shape) {
        shape._position.rotation.set(0, 0, 0);
    }
});