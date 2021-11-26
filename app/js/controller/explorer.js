/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.Explorer = class Explorer {

        /**
         * @type {HC.Controller}
         */
        controller;

        /**
         * @type {HC.Config}
         */
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
            this.config = controller.config;
            this.gui = new HC.GuifyExplorer('Presets', 'presets', true, this);
            this.load(() => {
                this.presetMan.restoreLoadedPresets();
            });
        }

        /**
         * 
         */
        load(callback) {
            this.messaging.files(STORAGE_DIR, (data) => {
                let _insert = (children, parent) => {
                    let calls = [];
                    for (let k in children) {
                        let child = children[k];

                        if (child.type === 'folder') {
                            calls.push((_loaded) => {
                                HC.TimeoutManager.add('HC.Explorer.load.' + k, SKIP_TWO_FRAMES, () => {
                                    let folder = parent.addFolder(child.name, null, false);
                                    _insert(child.children, folder);
                                    folder.finishLayout(child, this.presetMan);
                                    _loaded();
                                });
                            });
                        } else {
                            parent.addPreset(child, this.presetMan);
                        }
                    }

                    HC.TimeoutManager.chainExecuteCalls(calls, callback);
                };
                _insert(this.default, this.gui);
                _insert(data, this.gui);
                if (callback) {
                    callback();
                }
            });
        }

        reload(callback) {
            this.gui.removeChildren();
            this.load(callback);
        }

        /**
         * 
         */
        resetStatus(heap) {
            for (let layer = 0; layer < this.config.ControlValues.layers; layer++) {
                if (heap && heap.length) {
                    if (heap.indexOf(parseInt(layer+1)) > -1) {
                        continue;
                    }
                }

                this.resetLayerStatus(layer);
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
    }
}
