HC.plugins.lighting_pattern.ring = _class(false, HC.LightingPatternPlugin, {
    name: 'ring',

    apply: function (light, sides) {
        var layer = this.layer;

        if (!sides) {
            sides = this.settings.lighting_pattern_lights;
        }

        var px = this.settings.lighting_pattern_paddingx;
        var py = this.settings.lighting_pattern_paddingy;

        var seg = Math.PI * 2 / sides;
        var hseg = -Math.PI * 0.5;

        var r = layer.resolution('half').x / 2 * this.settings.lighting_pattern_padding;
        var i = light.userData.index % sides;

        var cos = Math.cos(hseg + seg * i);
        var sin = Math.sin(hseg + seg * i);

        var x = cos * r * px;
        var y = sin * r * py;
        var z = 0;

        this.positionIn2dSpace(light, x, -y, z);
    }
});