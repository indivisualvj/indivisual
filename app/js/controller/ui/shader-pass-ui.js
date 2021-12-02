/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.ShaderPassUi = class ShaderPassUi {

        name;

        controlSet;

        /**
         * @type {HC.Config}
         */
        config;

        shader;
        /**
         *
         * @param name
         * @param controlSet
         * @param config
         */
        constructor(name, controlSet, config) {
            this.name = name;
            this.controlSet = controlSet;
            this.config = config;
        }

        /**
         *
         * @param shader
         */
        init(shader) {
            shader.apply = true;
            this.setShader(shader);
        }

        /**
         *
         * @returns {*}
         */
        getShader() {
            return this.shader;
        }

        /**
         *
         * @param sh
         */
        setShader(sh) {
            this.shader = sh;
        }

        /**
         *
         * @returns {function(...[*]=)}
         */
        onChange() {
            return (v, that) => {
                if (that.getProperty() === 'apply' && v === false) {
                    this.controlSet.cleanShaderPasses();
                    this.config.messaging.program.updateUiPasses();
                }

                let data = {passes: {shaders: this.controlSet.getShaderPasses()}};
                this.config.messaging.program.pushShaderPasses(null, data);

                HC.log(that.getParent().getLabel() + '/' + that.getLabel(), v);
            };
        }

        /**
         *
         * @return {*}
         */
        getInitialSettings() {
            return this.config.ShaderSettings[this.name];
        }

        /**
         *
         * @param v
         * @param that
         */
        static onPasses(v, that) {

            if (v !== null && v.length !== 0 && v in messaging.program.config.AnimationValues.shaders) {
                let name = messaging.program.config.AnimationValues.shaders[v];
                if (name !== null) {
                    let ctrl = new HC.ShaderPassUi(v);
                    let sh = JSON.copy(messaging.program.config.ShaderSettings[v]);
                    ctrl.init(sh);

                    messaging.program.addShaderPass(
                        undefined,
                        ctrl
                    );
                }
            }
        }
    }
}
