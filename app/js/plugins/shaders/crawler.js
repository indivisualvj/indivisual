{
    HC.plugins.shaders.crawler = class Plugin extends HC.ShaderPlugin {
        static index = 170;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.CrawlerShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            index: 0,
            time: {
                value: 1,
                _type: [-3, 3, 0.001],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            strength: {
                value: 0.25,
                _type: [0, 5, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            displace: {value: true}
        }
    }
}