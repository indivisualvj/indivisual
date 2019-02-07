HC.plugins.lighting_lookat.randomshape = _class(false, HC.LightingLookatPlugin, {
    apply: function (light, peak) {
        if (this.isFirstShape(light)) {
            var speed = this.layer.getCurrentSpeed();
            if (!this.shape || (!peak && speed.prc == 0) || (peak && audio.peak && randomBool())) {
                this.shape = this.layer.getRandomShape();
            }
        }

        if (light.target != this.shape.mesh) {
            light.target = this.shape.mesh;
        }
    }
});

HC.plugins.lighting_lookat.randomshapepeak = _class(false, HC.LightingLookatPlugin, {
    apply: function (light) {
        this.layer.getLightingLookatPlugin('randomshape').apply(light, true);
    }
});

HC.plugins.lighting_lookat.randomshapes = _class(false, HC.LightingLookatPlugin, {
    apply: function (light, peak) {
        var params = light.userData;
        var speed = params.speed || this.layer.getCurrentSpeed();
        if (!params.shape || (!peak && speed.prc == 0) || (peak && audio.peak && randomBool())) {
            params.shape = this.layer.getRandomShape();
            params.speed = this.layer.getShapeSpeed(params.shape).speed;
        }

        if (light.target != params.shape.mesh) {
            light.target = params.shape.mesh;
        }
    }
});

HC.plugins.lighting_lookat.randomshapespeak = _class(false, HC.LightingLookatPlugin, {
    apply: function (light) {
        this.layer.getLightingLookatPlugin('randomshapes').apply(light, true);
    }
});