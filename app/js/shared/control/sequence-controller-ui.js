/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.SequenceControllerUi = class SequenceControllerUi extends HC.ControlSetGuifyUi {

        /**
         *
         * @param value
         * @param that
         */
        onChange(value, that) {
            messaging.program.updateSource(that.getProperty(), value, true, true, false);
        }

        addControllers() {
            super.addControllers();
            this._initSequences();
        }

        _initSequences() {
            let folders = this.folder.getFolders();
            for (let folder of folders) {
                new HC.SourceControllerSequence(messaging.program, folder);
            }
        }
    }
}
