/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.ControlControllerUi}
     */
    HC.ControlControllerUi = class ControlControllerUi extends HC.ControlSetGuifyUi {

        /**
         *
         * @param value
         * @param that
         */
        onChange(value, that) {
            this.config.messaging.program.updateControl(that.getProperty(), value, true, true, false);
        }
    }
}
