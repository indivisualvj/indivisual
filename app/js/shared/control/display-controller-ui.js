/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.DisplayControllerUi = class DisplayControllerUi extends HC.ControlSetGuifyUi {

        /**
         *
         * @param value
         * @param that
         */
        onChange(value, that) {
            messaging.program.updateDisplay(that.getProperty(), value, true, true, false);
        }
    }
}
