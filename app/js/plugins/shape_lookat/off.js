HC.plugins.shape_lookat.off = _class(false, HC.ShapeLookatPlugin, {
    index: 1,
    apply: function (shape) {
        shape.sceneObject().rotation.set(0, 0, 0);
        shape.getMesh().rotation.set(0, 0, 0);
    }
});