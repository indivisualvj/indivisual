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
            this._initDragAndDrop();
        }

        _initSequences() {
            let folders = this.folder.getFolders();
            for (let folder of folders) {
                new HC.SequenceUi(messaging.program, folder);
            }
        }


        _initDragAndDrop() {
            let sequences = document.querySelectorAll('#SequenceSettings .sequence');
            document.body.addEventListener('dragover', (e) => {
                if (!e.target.ancestorOfClass('sequence')) {
                    e.dataTransfer.dropEffect = 'none';
                    e.preventDefault();
                    sequences.forEach((sequence) => {
                        sequence.style.border = '';
                    });
                }
                e.preventDefault();
            });
        }
    }
}
