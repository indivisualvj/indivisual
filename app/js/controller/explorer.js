/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.Explorer = class Explorer {

        /**
         * @type {HC.GuifyExplorer}
         */
        gui;

        /**
         *
         * @param opts
         */
        constructor(opts) {
            this.gui = new HC.GuifyExplorer('Presets', 'presets', true, opts);
        }

        removeChildren() {
            this.gui.removeChildren();
        }

        /**
         *
         * @param layers{[]}
         */
        resetStatus(layers) {
            for (let i = 0; i < layers.length; i++) {
                this.resetLayerStatus(layers[i]);
            }
        }

        /**
         *
         * @param layer
         */
        resetLayerStatus(layer) {
            let ctrls = this.gui.getContainer().querySelectorAll('[data-label="' + (layer) + '"]');
            ctrls.forEach((ctrl) => {
                ctrl.removeAttribute('data-label');
                ctrl.removeAttribute('data-mnemonic');
                ctrl.removeAttribute('data-selected');
            });
        }

        /**
         *
         * @param layer
         * @param changed
         */
        setChanged(layer, changed) {
            let ctrls = this.gui.getContainer().querySelectorAll('[data-label="' + (layer) + '"]');
            ctrls.forEach((ctrl) => {
                ctrl.setAttribute('data-mnemonic', changed ? '!' : null);
            });
        }

        /**
         *
         * @param path
         * @param layer
         */
        setInfoByPath(path, layer) {
            let control = this.gui.findByPath(path);
            if (control) {
                control.setInfo(layer);
            }
        }


        /**
         * 
         * @param layer
         * @param loaded
         */
        setSelected(layer, loaded) {
            let ctrls = this.gui.getContainer().querySelectorAll('[data-selected]');
            ctrls.forEach((ctrl) => {
                ctrl.removeAttribute('data-selected');
            });

            ctrls = this.gui.getContainer().querySelectorAll('[data-label="' + (layer) + '"]');
            ctrls.forEach((ctrl) => {
                ctrl.setAttribute('data-selected', loaded ? 'true' : null);
            });
        }

        /**
         *
         * @param {string}label
         * @param {HC.GuifyExplorerFolder}parent
         * @param opts
         */
        addPreset(label, parent, opts) {
            opts.type = 'button';
            opts.label = label;

            parent.addPreset(opts);
        }

        /**
         *
         * @param parent
         * @param {string}label
         * @param {{}}opts
         * @returns {HC.GuifyExplorerFolder}
         */
        addFolder(parent, label, opts) {
            let folder = parent.addFolder(label);
            folder.finishLayout(opts);

            return folder;
        }
    }
}
