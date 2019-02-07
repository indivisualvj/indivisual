HC.plugins.shaders.mirror = _class(false, HC.ShaderPlugin, {
    index: 50,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.MirrorShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        side: {
            value: 1,
            _type: [0, 3, 1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    }
});