/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.ControlControllerUi = class ControlControllerUi extends HC.ControlSetGuifyUi {

        /**
         *
         * @param value
         * @param that
         */
        onChange(value, that) {
            messaging.program.updateControl(that.getProperty(), value, true, true, false);
        }
    }
}
