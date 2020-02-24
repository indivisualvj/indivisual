{
    HC.plugins.shaders.sobel_filter = class Plugin extends HC.ShaderPlugin {
        static index = 145;
        static name = 'sobel-filter';
        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.SobelFilter);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false
        }
    };
}
