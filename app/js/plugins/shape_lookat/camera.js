{
    HC.plugins.shape_lookat.camera = class Plugin extends HC.ShapeLookatPlugin {
        static index = 4;

        apply(shape) {
            let vector = this.layer.getCamera().position;
            shape.lookAt(vector);
        }
    }
}