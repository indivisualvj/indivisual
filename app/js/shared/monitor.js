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
         * @type {HTMLElement}
         */
        node;

        /**
         *
         */
        constructor() {
            this.node = document.getElementById('monitor');
        }

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

        activate(enable) {
            if (enable) {
                this.node.style.height = null;

            } else {
                this.node.style.height = this.node.clientHeight/2 + 'px';
            }
        }
    }
}
