{
    HC.plugins.shaders.hexagonsampling = class Plugin extends HC.ShaderPlugin {
        static index = 230;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.HexagonsamplingShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            divisor: {
                value: 80,
                _type: [1, 500, 0.5],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }
    }
}
