{
    HC.plugins.lighting_type.off = class Plugin extends HC.LightingTypePlugin {
        static index = 1;

        create() {
            return false;
        }
    }
}