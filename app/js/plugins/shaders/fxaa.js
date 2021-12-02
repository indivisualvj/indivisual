_importThreeShader('FXAAShader');
{
    HC.plugins.shaders.fxaa = class Plugin extends HC.ShaderPlugin {
        static index = 10;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.FXAAShader);
            }

            return this.pass;
        }

        updateResolution() {
            if (this.pass) {
                this.pass.uniforms.resolution.value.x = this.valueByWidth(1);
                this.pass.uniforms.resolution.value.y = this.valueByHeight(1);
            }
        }

        static settings = {
            apply: false,
            random: false,
            resolution: {
                x: {
                    value: 1,
                    _type: [1, 1000, 0.1],
                    _func: "valueByWidth",
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                },
                y: {
                    value: 1,
                    _type: [1, 1000, 0.1],
                    _func: "valueByHeight",
                    audio: false,
                    stepwise: false,
                    oscillate: "off"
                }
            }
        };

        valueByWidth(v) {
            return v / this.layer.resolution().x;
        }

        valueByHeight(v) {
            return v / this.layer.resolution().y;
        }
    }
}
