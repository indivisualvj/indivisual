HC.plugins.shaders.edgeglow = _class(false, HC.ShaderPlugin, {
    index: 150,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.EdgeGlowShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        color: {
            r: {
                value: 0,
                _type: [0, 2, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            g: {
                value: 1,
                _type: [0, 2, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            b: {
                value: 1,
                _type: [0, 2, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        },
        edgemode: {
            value: 0,
            _type: [0, 2, 1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    }
});