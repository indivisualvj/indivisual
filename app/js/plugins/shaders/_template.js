{
    HC.plugins.shaders._template = class Plugin extends HC.ShaderPlugin {
        static index = -1;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.RepeatShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            index: 0
        }
    };
}