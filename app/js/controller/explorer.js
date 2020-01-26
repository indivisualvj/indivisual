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

        statics;

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
         * @param settings
         */
        constructor(controller, settings) {
            this.controller = controller;
            this.messaging = controller.messaging;
            this.statics = settings;
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

                        if (child.type == 'folder') {
                            let folder = parent.addFolder(child.name, false);
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
            for (let k in this.gui.children) {
                let child = this.gui.children[k];
                child.remove();
            }

            this.load();
        }

        /**
         * 
         */
        resetPresets() {
            let ctrls = this.gui.getContainer().querySelectorAll('[data-label]');
            ctrls.forEach((ctrl) => {
                ctrl.removeAttribute('data-label');
            });

            ctrls = this.gui.getContainer().querySelectorAll('[data-mnemonic]');
            ctrls.forEach((ctrl) => {
                ctrl.removeAttribute('data-mnemonic');
            });
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
        setLoaded(layer, loaded) {

        }

        /**
         * 
         */
        resetLoaded() {

        }
    }
}
