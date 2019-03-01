{
    HC.plugins.shaders.bloom = class Plugin extends HC.ShaderPlugin {
        static index = 40;

        create() {
            if (!this.pass) {
                this.pass = new THREE.UnrealBloomPass(this.layer.resolution());
            }
            this.pass.setSize(this.layer.resolution().x, this.layer.resolution().y);

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            index: 0,
            strength: {
                value: 1.5,
                _type: [0, 3, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            threshold: {
                value: 0.5,
                _type: [0, 1, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            radius: {
                value: 0,
                _type: [0, 1, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            opacify: {
                value: true
            }
        }
    }
}