HC.plugins.shaders.mpeg = _class(false, HC.ShaderPlugin, {
    index: 80,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.MpegShader);
            this.pass.uniforms.nSampler.texture
                = this.pass.uniforms.nSampler.value
                = assetman.textures.rgbnoise;
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        time: {
            value: 1,
            _type: [0, 10, 0.001],
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
        }
    }
});