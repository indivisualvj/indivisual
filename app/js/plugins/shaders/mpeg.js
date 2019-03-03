{
    let rgbnoise;
    if (IS_ANIMATION) {
        assetman.loadTexture(filePath(TEXTURE_DIR, 'rgb-noise.png'), function (texture) {
            rgbnoise = texture;
        });
    }

    HC.plugins.shaders.mpeg = class Plugin extends HC.ShaderPlugin {
        static index = 80;
        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.MpegShader);
                this.pass.uniforms.nSampler.texture
                    = this.pass.uniforms.nSampler.value
                    = rgbnoise;
            }

            return this.pass;
        }
        static settings = {
            apply: false,
            random: false,
            index: 0,
            time: {
                value: 1,
                _type: [0, 10, 0.001],
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
            }
        }
    }
}