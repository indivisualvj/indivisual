/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.SourceControllerUi}
     */
    HC.SourceControllerUi = class SourceControllerUi extends HC.ControlSetGuifyUi {

        /**
         *
         * @param value
         * @param that
         */
        onChange(value, that) {
            messaging.program.updateSource(that.getProperty(), value, false, true, false);
        }


        /**
         * @param hook {Function|null}
         */
        addControllers(hook) {

            let folders = {};
            for(let key in this.controlSet.settings) {
                let ctrl = this.addController(key);
                if (ctrl) {
                    folders[ctrl.getParent().getLabel()] = ctrl.getParent();
                }
            }

            for (let k in folders) {
                this._finishFolder(folders[k]);
                if (hook) {
                    hook(folders[k]);
                }
            }
        }


        /**
         * @param hook {Function|null}
         */
        addControllers(hook) {

            let folders = {};
            for(let key in this.controlSet.settings) {
                let ctrl = this.addController(key);
                if (ctrl) {
                    folders[ctrl.getParent().getLabel()] = ctrl.getParent();
                }
            }

            for (let k in folders) {
                this._finishFolder(folders[k]);
                if (hook) {
                    hook(folders[k]);
                }
            }
        }
    }
}
