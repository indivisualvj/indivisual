/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Monitor}
     */
    HC.Monitor = class Monitor {

        /**
         * 
         * @param {HC.Config} config
         * @param {function} hook
         */
        init (config, hook) {
            config.DisplaySettingsManager.reset();
            config.ControlSettings.play = false;
            config.ControlSettings.monitor = false;
            config.DisplaySettings.fps = 30;
            config.DisplaySettings.display0_visible = true;

            if (hook) {
                hook();
            }
        }
    }
}
