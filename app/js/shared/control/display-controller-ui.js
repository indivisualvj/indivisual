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
            messaging.program.updateDisplay(that.getProperty(), value, false, true, false);
        }
    }
}
