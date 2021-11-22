{
    HC.plugins.shaders.ledmatrix = class Plugin extends HC.ShaderPlugin {
        static index = 210;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.DotMatrixShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            spacing: {
                value: 16,
                _type: [1, 500, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            size: {
                value: 3,
                _type: [0.5, 250, 0.5],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            blur: {
                value: 2,
                _type: [0, 250, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            punchedplate: {value: false}
        }
    }
}
