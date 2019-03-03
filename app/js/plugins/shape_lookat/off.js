{
    HC.plugins.shape_lookat.off = class Plugin extends HC.ShapeLookatPlugin {
        static index = 1;

        apply(shape) {
            shape.sceneObject().rotation.set(0, 0, 0);
            shape.getMesh().rotation.set(0, 0, 0);
        }
    }
}