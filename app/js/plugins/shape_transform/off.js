{
    HC.plugins.shape_transform.off = class Plugin extends HC.ShapeTransformPlugin {
        static index = 1;
        static name = 'off';

        apply(shape) {

        }

        _doesThings() {
            return false;
        }
    }
}