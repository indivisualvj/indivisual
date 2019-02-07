HC.plugins.shaders.fxaa = _class(false, HC.ShaderPlugin, {
    index: 10,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.FXAAShader);
        }

        return this.pass;
    },
    updateResolution: function () {
        if (this.pass) {
            this.pass.uniforms.resolution.value.x = this.valueByWidth(1);
            this.pass.uniforms.resolution.value.y = this.valueByHeight();
        }
    },
    settings: {
        apply: false,
        random: false,
        index: 1000,
        resolution: {
            x: {
                value: 1,
                _type: [1, 1000, 0.1],
                _func: "valueByWidth",
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            y: {
                value: 1,
                _type: [1, 1000, 0.1],
                _func: "valueByHeight",
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }
    },

    valueByWidth: function (v) {
        return v / this.layer.diameterVector.x;
    },

    valueByHeight: function (v) {
        return v / this.layer.diameterVector.y;
    }
});