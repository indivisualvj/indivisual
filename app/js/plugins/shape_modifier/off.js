{
    HC.plugins.shape_modifier.off = class Plugin extends HC.ShapeModifierPlugin {
        static index = 1;
        static name = 'off';

        create(geometry) {
            return geometry;
        }
    }
}