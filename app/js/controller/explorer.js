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
            this.controller = controller; // todo use it!
            this.messaging = controller.messaging;
            this.statics = settings; // todo use it!
            this.presetMan = new HC.PresetManager(this, this.messaging);

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
         * @param layer
         * @param model
         */
        setPreset(layer, model) {

        }

        /**
         * 
         */
        resetPresets() {
            for (let i = 0; i < statics.ControlValues.layer.length; i++) {
                this.setPreset(i, false);
            }
        }

        /**
         * fixme wenever preset is loaded its status is set to changed by guify colorpicker
         * @param layer
         * @param changed
         */
        setChanged(layer, changed) {
            let ctrls = this.gui.getContainer().querySelectorAll('[data-label="' + (layer+1) + '"]');
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
