{
    HC.plugins.shaders.drawing = class Plugin extends HC.ShaderPlugin {
        static index = 140;

        create() {
            if (!this.pass) {
                this.pass = new THREE.ShaderPass(THREE.DrawingShader);
            }

            return this.pass;
        }

        static settings = {
            apply: false,
            random: false,
            onebit: {value: false}
        }
    }
}
