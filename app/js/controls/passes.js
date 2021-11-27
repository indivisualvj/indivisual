/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.controls.passes = class ControlSet extends HC.ControlSet {

        static index = 190;
        static _name = 'shader passes';
        visible = false;

        settings = {
            shaders: []
        };

        types = {};

        /**
         *
         * @param index
         * @returns {string}
         */
        getShaderName(index) {
            let pass = this.getPropertyAt('shaders', index);
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
            let pass = this.getPropertyAt('shaders', index);
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
}