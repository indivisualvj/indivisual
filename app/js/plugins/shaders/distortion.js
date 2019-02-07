HC.plugins.shaders.distortion = _class(false, HC.ShaderPlugin, {
    index: 90,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.DistortionShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        multiplier: {
            value: 0,
            _type: [0, 2, 0.001],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        strength: {
            value: 0.15,
            _type: [0, 5, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        offset: {
            x: {
                value: 0.5,
                _type: [-0.5, 1.5, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            y: {
                value: 0.5,
                _type: [-0.5, 1.5, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }
    }
});