HC.plugins.shaders.smearing = _class(false, HC.ShaderPlugin, {
    index: 185,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.SmearingPass();
        }
        this.pass.setSize(this.layer.resolution().x, this.layer.resolution().y);

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        opacity: {
            value: 0.80,
            _type: [0, 1, 0.01],
            audio: false,
            oscillate: "off"
        }
    }
});