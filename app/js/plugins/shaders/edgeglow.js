{
    HC.plugins.shaders.edgeglow = class Plugin extends HC.ShaderPlugin {
        static index = 150;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.EdgeGlowShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            index: 0,
            color: {
                r: {
                    value: 0,
                    _type: [0, 2, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                g: {
                    value: 1,
                    _type: [0, 2, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                b: {
                    value: 1,
                    _type: [0, 2, 0.01],
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                }
            },
            edgemode: {
                value: 0,
                _type: [0, 2, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }
    }
}