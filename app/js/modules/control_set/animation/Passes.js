/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ControlSet} from "../../../shared/ControlSet";

class Passes extends ControlSet
{
    static index = 190;
    static _name = 'shader passes';
    visible = false;

    settings = {
        shaders: []
    };

    types = {};

    /**
     *
     * @param shader
     */
    addShaderPass(shader) {
        this.properties.shaders.push(shader);
    }

    /**
     *
     * @param index
     * @param shader
     */
    insertShaderPass(index, shader) {
        this.properties.shaders.splice(index, 0, shader);
    }

    /**
     *
     * @param index
     */
    removeShaderPass(index) {
        this.properties.shaders.splice(index, 1);
    }

    /**
     *
     */
    removeShaderPasses() {
        this.properties.shaders = [];
    }

    /**
     *
     */
    cleanShaderPasses() {
        let passes = this.getShaderPasses();

        for (let key in passes) {
            let sh = this.getShader(key);
            if (!sh || sh.apply === false) {
                this.removeShaderPass(key);
            }
        }
    }

    /**
     *
     * @returns {[]}
     */
    getShaderPasses() {
        return this.properties.shaders;
    }

    /**
     *
     * @param index
     * @returns {null|{}}
     */
    getShaderPass(index) {
        let passes = this.getShaderPasses();

        if (index in passes) {
            return passes[index];
        }

        return null;
    }

    /**
     *
     * @param index
     * @returns {string}
     */
    getShaderName(index) {
        let pass = this.getShaderPass(index);
        if (pass) {
            return Object.keys(pass)[0];
        }

        return null;
    }

    /**
     *
     * @param index
     * @returns {string}
     */
    getShaderPassKey(index) {
        let name = this.getShaderName(index);
        let count = 0;

        for (let k in this.properties.shaders) {
            if (k === index) {
                break;
            }
            if (this.getShaderName(k) === name) {
                count++;
            }
        }

        return name + '' + count;
    }

    /**
     *
     * @param index
     * @param name
     * @returns {null|*}
     */
    getShader(index, name) {
        let pass = this.getShaderPass(index);
        if (pass) {
            let name = this.getShaderName(index);
            return pass[name];
        }

        return null;
    }

    /**
     *
     * @returns {boolean}
     */
    isDefault() {
        return this.properties.shaders.length === 0;
    }
}

export {Passes}