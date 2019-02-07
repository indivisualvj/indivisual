HC.plugins.shaders.noise = _class(false, HC.ShaderPlugin, {
    index: 110,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.NoiseShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        smoothness: {
            value: 0.02,
            _type: [0, 32, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        threshold: {
            value: 1,
            _type: [0.5, 2, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    }
});