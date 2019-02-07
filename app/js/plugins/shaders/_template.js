HC.plugins.shaders._template = _class(false, HC.ShaderPlugin, {
    index: -1,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.RepeatShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0
    }
});