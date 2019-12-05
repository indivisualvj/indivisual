/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.controls.passes}
     */
    HC.controls.passes = class ControlSet extends HC.ControlSet {

        static index = 190;

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