/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.offset}
     */
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
    }
}