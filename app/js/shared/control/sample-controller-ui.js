/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.SampleControllerUi = class SampleControllerUi extends HC.ControlSetGuifyUi {

        /**
         *
         * @type {[]}
         */
        thumbs = []

        addControllers(onDragStart, onDragEnd) {
            for (let i in this.controlSet.types) {
                i = HC.numberExtract(i, 'sample')
                let key = getSampleKey(i);
                this.addFolder(key)

                let thumb = new HC.SourceControllerSample(i);
                thumb.init(this.folder.getFolderContainer());
                thumb.initDragAndDrop(onDragStart, onDragEnd);
                thumb.initEvents();
                this.thumbs.push(thumb);

                this._addControllers(key);
                this._styleFolder(this.folder, key, i?'noclear':'clear');
            }
        }

        /**
         *
         * @param folder
         * @param key
         * @param _class
         * @private
         */
        _styleFolder(folder, key, _class) {
            let folderContainer = folder.getFolderContainer();
            let container = folder.getContainer();
            container.parentNode.removeChild(container);
            folderContainer.setAttribute('data-class', 'hex');
            folderContainer.setAttribute('data-id', key);
            folderContainer.classList.add(_class);
        }

        /**
         *
         * @param prefix
         * @private
         */
        _addControllers(prefix) {
            for(let key in this.controlSet.settings) {
                if (key.startsWith(prefix)) {
                    this.addController(key);
                }
            }
        }

        addFolder(key) {
            let folder = new HC.GuifyFolder(this.gui, null, key, true);
            folder.setKey(key);
            this.folder = folder;

            return this.folder;
        }

        /**
         *
         * @param value
         * @param that
         */
        onChange(value, that) {
            messaging.program.updateSource(that.getProperty(), value, true, true, false);
        }

        initDragAndDrop() { // todo this can be moved to sequence ui
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
