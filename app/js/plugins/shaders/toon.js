{
    HC.plugins.shaders.toon = class Plugin extends HC.ShaderPlugin {
        static index = 245;
        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.SimpleToon);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false
        }
    };
}
