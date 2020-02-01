{
    HC.plugins.shaders.twist = class Plugin extends HC.ShaderPlugin {
        static index = 180;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.TwistShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            radius: {
                value: 0.5,
                _type: [0, 1, 0.001],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            angle: {
                value: 5,
                _type: [-10, 10, 0.001],
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
