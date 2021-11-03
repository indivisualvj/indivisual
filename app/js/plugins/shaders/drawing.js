{
    HC.plugins.shaders.drawing = class Plugin extends HC.ShaderPlugin {
        static index = 140;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.DrawingShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            onebit: {value: false},
            intensity: {
                value: 8,
                _type: [2, 16, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            radius: {
                value: 2.0,
                _type: [1., 16, .25],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
        }
    }
}
