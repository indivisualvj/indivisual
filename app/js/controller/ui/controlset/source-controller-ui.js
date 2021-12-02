/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.SourceControllerUi = class SourceControllerUi extends HC.ControlSetGuifyUi {

        /**
         *
         * @param value
         * @param that
         */
        onChange(value, that) {
            messaging.program.updateSource(that.getProperty(), value, true, true, false);
        }
    }
}
