HC.plugins.shaders.repeat = _class(false, HC.ShaderPlugin, {
    index: 45,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.RepeatShader);
        }
        this.pass.uniforms.resolution.value.x = this.layer.resolution().x;
        this.pass.uniforms.resolution.value.y = this.layer.resolution().y;

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        divider: {
            x: {
                value: 2,
                _type: [0, 32, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            y: {
                value: 2,
                _type: [0, 32, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        },
        operation: {
            value: 0,
            _type: [0, 14, 1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        flipX: {
            value: 0,
            _type: [0, 1, 1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        flipY: {
            value: 0,
            _type: [0, 1, 1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    }
});