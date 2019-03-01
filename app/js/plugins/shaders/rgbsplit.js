{
    HC.plugins.shaders.rgbsplit = class Plugin extends HC.ShaderPlugin {
        static index = 190;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.RGBShiftShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            index: 0,
            amount: {
                value: 0.005,
                _type: [0, 3, 0.001],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            angle: {
                value: 0,
                _type: [-5, 5, 0.001],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }
    }
}