{
    HC.plugins.sizing_flip.off = class Plugin extends HC.ShapeTransformPlugin {
        static index = 1; // hast to be first @see HC.plugins.sizing_flip.random
        static name = 'off';

        apply(shape) {
            let layer = this.layer;
            shape.flip(1, 1, 1);
        }
    }
}