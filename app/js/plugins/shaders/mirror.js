_importThreeShader('MirrorShader');
{
    HC.plugins.shaders.mirror = class Plugin extends HC.ShaderPlugin {
        static index = 50;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.MirrorShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            side: {
                value: 1,
                _type: [0, 3, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }
    }
}
