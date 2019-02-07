HC.plugins.shaders.worley = _class(false, HC.ShaderPlugin, {
    index: 160,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.WorleyShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        time: {
            value: 1,
            _type: [-3, 3, 0.001],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        strength: {
            value: 0.25,
            _type: [0, 5, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        scale: {
            value: 1,
            _type: [0, 100, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        displace: {value: false}
    }
});