{
    HC.plugins.shaders.crosshatch = class Plugin extends HC.ShaderPlugin {
        static index = 240;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.CrossHatchShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            spacing: {
                value: 10,
                _type: [0.1, 24, 0.1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }
    }
}
