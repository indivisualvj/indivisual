{
    HC.plugins.shaders.film = class Plugin extends HC.ShaderPlugin {
        static index = 70;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.FilmShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            time: {
                value: 1,
                _type: [-10, 10, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "incrementalpeak"
            },
            scanlines: {
                value: 512,
                _type: [1, 1024, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            scanlines_intensity: {
                value: 0.05,
                _type: [0, 5, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            noise: {
                value: 0.5,
                _type: [0, 5, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            grayscale: {value: false}
        }
    }
}
