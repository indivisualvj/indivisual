/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.controls.shaders}
     */
    HC.controls.shaders = class ControlSet extends HC.ControlSet {

        static index = 180;

        plugin;

        /**
         *
         * @param HC.ShaderPlugin plugin
         */
        construct(plugin) {
            this.plugin = plugin;
            this.settings = plugin.__proto__.constructor.settings;

            super.construct();
        }
    }
}