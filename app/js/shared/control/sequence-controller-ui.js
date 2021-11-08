/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.SequenceControllerUi}
     */
    HC.SequenceControllerUi = class SequenceControllerUi extends HC.ControlSetGuifyUi {

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
