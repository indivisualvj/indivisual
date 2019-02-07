HC.plugins.shaders.paint = _class(false, HC.ShaderPlugin, {
    index: 120,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.PaintShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        colorOffset: {
            value: 0.95,
            _type: [0, 2, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        colorFactor: {
            value: 0,
            _type: [0, 2, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        sampleDistance: {
            value: 0.54,
            _type: [-10, 10, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        waveFactor: {
            value: 0.00127,
            _type: [0, 0.5, 0.0001],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    }
});