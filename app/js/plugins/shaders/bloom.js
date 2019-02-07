HC.plugins.shaders.bloom = _class(false, HC.ShaderPlugin, {
    index: 40,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.UnrealBloomPass(this.layer.diameterVector);
        }
        this.pass.setSize(this.layer.diameterVector.x, this.layer.diameterVector.y);

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        strength: {
            value: 1.5,
            _type: [0, 3, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        threshold: {
            value: 0.5,
            _type: [0, 1, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        radius: {
            value: 0,
            _type: [0, 1, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        opacify: {
            value: true
        }
    }
});