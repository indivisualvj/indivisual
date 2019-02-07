HC.plugins.shaders.film = _class(false, HC.ShaderPlugin, {
    index: 70,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.FilmShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        time: {
            value: 1,
            _type: [-10, 10, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        scanlines: {
            value: 512,
            _type: [1, 1024, 1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        scanlines_intensity: {
            value: 0.05,
            _type: [0, 5, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        noise: {
            value: 0.5,
            _type: [0, 5, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        grayscale: {value: false}
    }
});