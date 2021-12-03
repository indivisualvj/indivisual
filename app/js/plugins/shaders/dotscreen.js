{
    if (!IS_CONTROLLER) {
        _importThreeShader('DotScreenShader');
    }

    HC.plugins.shaders.dotscreen = class Plugin extends HC.ShaderPlugin {
        static index = 200;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.DotScreenShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            scale: {
                value: 0.5,
                _type: [0, 5, 0.001],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            angle: {
                value: 5,
                _type: [-10, 10, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }
    }
}
