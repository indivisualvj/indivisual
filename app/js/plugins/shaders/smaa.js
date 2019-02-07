HC.plugins.shaders.smaa = _class(false, HC.ShaderPlugin, {
    index: 5,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.SMAAPass(this.layer.diameterVector.x, this.layer.diameterVector.y);
        }
        this.pass.setSize(this.layer.diameterVector.x, this.layer.diameterVector.y);

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 1001
    }
});