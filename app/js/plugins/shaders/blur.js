{
    HC.plugins.shaders.blur = class Plugin extends HC.ShaderPlugin {
        static index = 130;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.BlurShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
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
    }
}
