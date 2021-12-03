/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {Messaging} from "../../lib/Messaging";

class ShaderPassUi {

    name;

    controlSet;

    /**
     * @type {Config}
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
                Messaging.program.updateUiPasses();
            }

            let data = {passes: {shaders: this.controlSet.getShaderPasses()}};
            Messaging.program.pushShaderPasses(null, data);

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

        if (v !== null && v.length !== 0 && v in Messaging.program.config.AnimationValues.shaders) {
            let name = Messaging.program.config.AnimationValues.shaders[v];
            if (name !== null) {
                let ctrl = new ShaderPassUi(v);
                let sh = JSON.copy(Messaging.program.config.ShaderSettings[v]);
                ctrl.init(sh);

                Messaging.program.addShaderPass(
                    undefined,
                    ctrl
                );
            }
        }
    }
}

export {ShaderPassUi}