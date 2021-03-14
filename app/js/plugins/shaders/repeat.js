{
    HC.plugins.shaders.repeat = class Plugin extends HC.ShaderPlugin {
        static index = 45;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.RepeatShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
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
    }
}
