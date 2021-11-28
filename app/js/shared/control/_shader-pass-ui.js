/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.ShaderPassUi = class ShaderPassUi {

        shader;
        name;

        /**
         * @type {HC.Config}
         */
        config;

        /**
         *
         * @param name
         * @param {HC.Config} config
         */
        constructor(name, config) {
            this.name = name;
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
                    this.config.messaging.program.cleanShaderPasses();
                    this.config.messaging.program.updateUiPasses();
                }

                let passes = this.config.messaging.program.settingsManager.get(this.config.ControlSettings.layer, 'passes');
                let data = {passes: {shaders: passes.getShaderPasses()}};
                messaging.emitSettings(this.config.ControlSettings.layer, data, false, false, false);

                HC.log(that.getParent().getLabel() + '/' + that.getLabel(), v);
            };
        }

        /**
         *
         * @return {*}
         */
        getInitialSettings(key) {
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
