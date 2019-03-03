{
    HC.plugins.shaders.glitch = class Plugin extends HC.ShaderPlugin {
        static index = 100;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.GlitchShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            index: 0,
            twist: {
                value: 1,
                _type: [0, 64, 0.1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            brightness: {
                value: 1,
                _type: [0, 1, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            offset: {
                x: {
                    value: 0.5,
                    _type: [-2, 2, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                y: {
                    value: 0.5,
                    _type: [-2, 2, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                }
            },
            zoom: {
                x: {
                    value: 1,
                    _type: [0.1, 8, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                y: {
                    value: 1,
                    _type: [0.1, 8, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                }
            }
        }
    }
}