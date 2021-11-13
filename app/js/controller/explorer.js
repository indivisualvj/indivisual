/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Explorer}
     */
    HC.Explorer = class Explorer {

        /**
         * @type {HC.Controller}
         */
        controller;

        config;

        /**
         * @type {HC.GuifyExplorer}
         */
        gui;

        /**
         * @type {HC.PresetManager}
         */
        presetMan;

        /**
         * @type {HC.Messaging}
         */
        messaging;

        /**
         *
         * @type {Array}
         */
        default = [{
            name: '_default',
            type: 'folder',
            default: true,
            visible: true,
            children: [
                {
                    index: 0,
                    name: '_default',
                    type: 'preset',
                    default: true,
                    loaded: false,
                    layer: '',
                    changed: ''
                }
            ]
        }];

        /**
         *
         * @param {HC.Controller} controller
         */
        constructor(controller) {
            this.controller = controller;
            this.messaging = controller.messaging;
            this.presetMan = new HC.PresetManager(controller, this);

            this.gui = new HC.GuifyExplorer('Presets', true, this);
            this.load();
        }

        /**
         * 
         */
        load() {
            this.messaging.files(STORAGE_DIR, (data) => {
                let _insert = (children, parent) => {
                    for (let k in children) {
                        let child = children[k];

                        if (child.type === 'folder') {
                            let folder = parent.addFolder(child.name, null, false);
                            _insert(child.children, folder);
                            folder.finishLayout(child, this.presetMan);

                        } else {
                            parent.addPreset(child, this.presetMan);

                        }
                    }
                };
                _insert(this.default, this.gui);
                _insert(data, this.gui);
            });
        }

        /**
         *
         */
        reload() {

            // todo: is it possible to preserve loaded? maybe name attribute of settings is set?
            this.gui.removeChildren();
            this.load();
        }

        /**
         * 
         */
        resetPresets(heap) {
            let children = this.gui.getAllControllers();

            for (const key in children) {
                let child = children[key];
                let info = child.getInfo();
                let mnemonic = child.getMnemonic();

                if (heap && heap.length) {
                    if (heap.indexOf(parseInt(info)) > -1) {
                        continue;
                    }
                }

                child.setInfo(null);
                child.setMnemonic(null);
            }
        }

        /**
         *
         * @param layer
         */
        resetPreset(layer) {
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
    }
}
