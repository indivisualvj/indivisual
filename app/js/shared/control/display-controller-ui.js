/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.DisplayControllerUi}
     */
    HC.DisplayControllerUi = class DisplayControllerUi extends HC.ControlSetGuifyUi {

        /**
         *
         * @param value
         * @param that
         */
        onChange(value, that) {
            this.config.messaging.program.updateDisplay(that.getProperty(), value, true, true, false);
        }
    }
}
