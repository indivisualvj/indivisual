HC.plugins.shaders.blur = _class(false, HC.ShaderPlugin, {
    index: 130,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.BlurShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        blurX: {
            value: 0.1,
            _type: [0, 500, 0.1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        blurY: {
            value: 0.1,
            _type: [0, 500, 0.1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    }
});