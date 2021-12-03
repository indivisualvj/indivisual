/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import {ControlSetGuifyUi} from "./ControlSetGuifyUi";
import {Messaging} from "../../../lib/Messaging";

class SequenceControllerUi extends ControlSetGuifyUi {

    /**
     *
     * @param value
     * @param that
     */
    onChange(value, that) {
        Messaging.program.updateSource(that.getProperty(), value, true, true, false);
    }

    addControllers() {
        super.addControllers();
        this._initSequences();
        this._initDragAndDrop();
    }

    _initSequences() {
        let folders = this.folder.getFolders();
        for (let folder of folders) {
            new SequenceUi(Messaging.program, folder);
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

export {SequenceControllerUi}
