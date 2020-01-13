{
    HC.plugins.shaders.pixelate = class Plugin extends HC.ShaderPlugin {
        static index = 220;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.PixelateShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            size: {
                x: {
                    value: 4,
                    _type: [1, 64, 1],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                y: {
                    value: 4,
                    _type: [1, 64, 1],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                }
            }
        }
    }
}
