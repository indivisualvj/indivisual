HC.plugins.shaders.drawing = _class(false, HC.ShaderPlugin, {
    index: 140,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.DrawingShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        onebit: {value: false}
    }
});