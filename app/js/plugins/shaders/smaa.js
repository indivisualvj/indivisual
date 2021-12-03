{
    if (!IS_CONTROLLER) {
        _importThreeShader('SMAAShader');
        _importThreePostprocessing('SMAAPass');
    }

    HC.plugins.shaders.smaa = class Plugin extends HC.ShaderPlugin {
        static index = 5;

        create() {
            if (!this.pass) {
                this.pass = new THREE.SMAAPass(this.layer.resolution().x, this.layer.resolution().y);
            }
            this.pass.setSize(this.layer.resolution().x, this.layer.resolution().y);

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false
        }
    }
}
