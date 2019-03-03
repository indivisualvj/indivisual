{
    HC.plugins.lighting_pattern.ring = class Plugin extends HC.LightingPatternPlugin {
        static name = 'ring';

        apply(light, sides) {
            let layer = this.layer;

            if (!sides) {
                sides = this.settings.lighting_pattern_lights;
            }

            let px = this.settings.lighting_pattern_paddingx;
            let py = this.settings.lighting_pattern_paddingy;

            let seg = Math.PI * 2 / sides;
            let hseg = -Math.PI * 0.5;

            let r = layer.resolution('half').x / 2 * this.settings.lighting_pattern_padding;
            let i = light.userData.index % sides;

            let cos = Math.cos(hseg + seg * i);
            let sin = Math.sin(hseg + seg * i);

            let x = cos * r * px;
            let y = sin * r * py;
            let z = 0;

            this.positionIn2dSpace(light, x, -y, z);
        }
    }
}