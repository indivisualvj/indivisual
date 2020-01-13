{
    HC.plugins.shaders.kaleidoscope = class Plugin extends HC.ShaderPlugin {
        static index = 60;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.KaleidoShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            sides: {
                value: 6,
                _type: [2, 16, 1],
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
            },
            radius: {
                value: 0.5,
                _type: [-5, 5, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            offset: {
                x: {
                    value: 0.5,
                    _type: [0, 1, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                y: {
                    value: 0.5,
                    _type: [0, 1, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                }
            }
        }
    }
}
