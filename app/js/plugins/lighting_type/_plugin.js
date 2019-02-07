HC.plugins.lighting_type = HC.plugins.lighting_type || {};

HC.LightingTypePlugin = _class(false, HC.Plugin, {

    apply: function (index) {
        var light = this.create();

        if (light) {
            light.userData.index = index;

            return light;
        }

        return false;
    },

    update: function (light) {
        if (light.castShadow !== undefined) {
            light.castShadow = this.settings.lighting_shadows;
        }

        if (light.angle !== undefined) {
            light.angle = this.settings.lighting_angle;
        }

        if (light.penumbra !== undefined) {
            light.penumbra = this.settings.lighting_penumbra;
        }

        if (light.intensity !== undefined) {
            light.intensity = this.settings.lighting_intensity;
        }
    }
});