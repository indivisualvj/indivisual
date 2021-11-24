/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.PresetManager = class PresetManager {

        /**
         * @type {HC.Controller}
         */
        controller;

        /**
         * @type {HC.Config}
         */
        config;

        /**
         * @type {HC.Explorer}
         */
        explorer;

        /**
         * @type {HC.Messaging}
         */
        filesystem;

        /**
         * @type {HC.LayeredControlSetsManager}
         */
        settingsManager;

        /**
         * 
         * @param {HC.Controller} controller
         * @param {HC.Explorer} explorer
         */
        constructor(controller, explorer) {
            this.controller = controller;
            this.config = controller.config;
            this.explorer = explorer;
            this.filesystem = controller.messaging;
            this.settingsManager = controller.settingsManager;
        }

        /**
         *
         * @param {HC.GuifyExplorerPreset} ctrl
         */
        loadPreset(ctrl) {
            if (ctrl.getLabel() === '_default') {
                // load default
                this.settingsManager.setLayerProperties(this.config.ControlSettings.layer, false);
                HC.TimeoutManager.getInstance().add('loadPreset', 0, () => {
                    this.explorer.resetPreset(this.config.ControlSettings.layer + 1);
                    this.controller.updatePreset(false, this.settingsManager.prepareLayer(this.config.ControlSettings.layer));
                });

            } else {
                // load preset
                this.filesystem.load(STORAGE_DIR, ctrl.getParent().getLabel(), ctrl.getLabel(), (data) => {
                    HC.TimeoutManager.getInstance().add('loadPreset', 0, () => {

                        if (HC.Hotkey.isPressed('ctrl')) { //load shaders into present presets
                            this.controller.transferShaderPasses(data.dir + '/' + data.name, JSON.parse(data.contents));

                        } else {
                            // load the preset

                            HC.clearLog();

                            let key = data.dir + '/' + data.name;
                            let contents = JSON.parse(data.contents);

                            this.controller.updatePreset(key, contents);
                            let layer = this.config.ControlSettings.layer + 1;
                            this.explorer.resetPreset(layer);
                            ctrl.setInfo(layer);
                            ctrl.setSelected(true);
                        }
                    });
                });
            }
        }

        /**
         *
         * @param {HC.GuifyExplorerFolder} folder
         */
        loadPresets(folder) {
            let children = Object.keys(folder.children);
            let candidates = [];

            for (let layer = 0; candidates.length < this.config.ControlValues.layers && layer < children.length; layer++) {
                let child = folder.getChild(children[layer]);
                candidates.push(child);
            }
            this.explorer.resetPresets();

            HC.clearLog();

            let candidate = 0;
            for (let layer = 0; layer < this.config.ControlValues.layers; layer++) {
                if (this.config.shuffleable(layer+1)) {
                    if (candidate < candidates.length) {
                        this._loadPreset(candidates[candidate], layer, candidate, candidate * SKIP_TEN_FRAMES);
                        candidate++;

                    } else { // always reset but do it slowly
                        HC.TimeoutManager.getInstance().add('updatePreset.' + layer, layer * SKIP_TEN_FRAMES, () => {
                            this.controller.resetLayer(layer);
                        });
                    }
                }
            }
        }

        /**
         *
         * @param {HC.GuifyExplorerFolder} folder
         */
        appendPresets(folder) {
            let children = Object.keys(folder.children);
            let dflt = [];
            let layers = this.config.ControlValues.layers;

            for (let i = 0; dflt.length < layers && i < children.length; i++) {
                let child = folder.getChild(children[i]);
                if (!child.getLabel().match(/^_.+/)) {
                    dflt.push(child);
                }
            }

            HC.clearLog();

            let di = 0;
            for (let i = 0; i < layers; i++) {
                if (!this.settingsManager.isDefault(i)) {
                    continue;
                }

                if (!this.config.shuffleable(i+1)) {
                    continue;
                }

                if (di < dflt.length) {
                    this._loadPreset(dflt[di], i, di, di === dflt.length - 1);
                    di++;

                } else {
                    this.controller.updatePreset(false, this.settingsManager.prepareLayer(this.config.ControlSettings.layer));
                }
            }
        }

        /**
         *
         * @param child
         * @param i
         * @param di
         * @param timeout
         * @private
         */
        _loadPreset(child, i, di, timeout) {

            child.setInfo(i+1);

            console.log('loading', child.getLabel());
            this.filesystem.load(STORAGE_DIR, child.getParent().getLabel(), child.getLabel(), (data) => {
                HC.TimeoutManager.getInstance().add('_loadPreset' + child.getLabel(), timeout || 0, () => {
                    let key = data.dir + '/' + data.name;
                    let contents = JSON.parse(data.contents);
                    console.log('loaded', data.name);
                    this.controller.updatePreset(key, contents, i);
                });
            });
        };

        /**
         *
         * @param {HC.GuifyExplorerFolder} ctrl
         */
        savePresets(ctrl) {
            let confirmed = confirm('Save all?');
            if (confirmed) {
                for (let k in ctrl.children) {
                    let child = ctrl.children[k];
                    let layer = parseInt(child.getInfo()) - 1;

                    if (layer >= 0 && child.getChanged()) {
                        let save = (layer, child) => {
                            let settings = this.settingsManager.prepareLayer(layer);
                            this.filesystem.save(STORAGE_DIR, ctrl.getLabel(), child.getLabel(), settings, (result) => {
                                HC.log(result);
                                child.setChanged(null);
                            }, '');
                        };

                        save(layer, child);
                    }
                }
            }
        }

        /**
         *
         * @param {HC.GuifyExplorerPreset} ctrl
         */
        savePreset(ctrl) {
            let settings = this.settingsManager.prepareLayer(this.config.ControlSettings.layer);
            let dir = ctrl.getParent().getLabel();
            let label = ctrl.getLabel();
            settings.info.name = HC.filePath(dir, label);

            this.filesystem.save(STORAGE_DIR, dir, label, settings, (result) => {
                HC.log(result);
                ctrl.setChanged(null);
            });
        }

        /**
         *
         * @param {HC.GuifyExplorerFolder} ctrl
         */
        newPreset(ctrl) {
            let index = (Object.keys(ctrl.children).length + 1);
            while (ctrl.getChild(index + '.json')) { // lookup for existing
                index++;
            }
            let label = index.toString();

            do {
                label = prompt('Please specify a name (no duplicates)', label);
            } while (label && ctrl.getChild(label + '.json'));

            if (label) {
                label += '.json';

                let preset = this.settingsManager.prepareLayer(this.config.ControlSettings.layer);
                let nu = {
                    type: 'file',
                    dir: ctrl.getLabel(),
                    name: label,
                    settings: preset
                };

                preset.info.name = HC.filePath(nu.dir, nu.name);

                this.filesystem.save(STORAGE_DIR, nu.dir, nu.name, nu.settings, (result) => {
                    HC.log(result);
                    ctrl.addPreset(nu, this);
                }, '');
            }
        }

        /**
         *
         * @param {HC.GuifyExplorerPreset} ctrl
         */
        deleteFolder(ctrl) {
            let confirmed = confirm('Do you want to delete "' + ctrl.getLabel() + '"?');
            if (confirmed) {
                this.filesystem.delete(STORAGE_DIR, null, ctrl.getLabel(), (result) => {
                    HC.log(result);
                    ctrl.removeFromParent();
                });
            }
        }

        /**
         *
         * @param {HC.GuifyExplorerPreset} ctrl
         */
        deletePreset(ctrl) {
            let confirmed = confirm('Do you want to delete "' + ctrl.getLabel() + '"?');
            if (confirmed) {
                this.filesystem.delete(STORAGE_DIR, ctrl.getParent().getLabel(), ctrl.getLabel(), (result) => {
                    HC.log(result);
                    ctrl.removeFromParent();
                });
            }
        }

        /**
         *
         * @param {HC.GuifyExplorer} ctrl
         */
        newFolder(ctrl) {
            let label = '__NEW__';

            do {
                label = prompt('Please specify a name (no duplicates)', label);
            } while (label && ctrl.getChild(label));

            if (label) {
                this.filesystem.mkdir(STORAGE_DIR, label, false, (result) => {
                    HC.log(result);
                    let folder = ctrl.addFolder(label);
                    folder.finishLayout({}, this);
                });
            }
        }

        /**
         *
         * @param {HC.GuifyItem} ctrl
         */
        renameFolder(ctrl) {
            let label = ctrl.getLabel();

            do {
                label = prompt('Please specify a name (no duplicates)', label);
            } while (label && ctrl.getParent().getChild(label));

            if (label) {
                this.filesystem.rename(STORAGE_DIR, null, ctrl.getLabel(), label, (result) => {
                    HC.log(result);
                    ctrl.rename(label);
                });

            }
        }

        /**
         *
         * @param {HC.GuifyItem} ctrl
         */
        renamePreset(ctrl) {
            let label = ctrl.getLabel();
            let split = label.split('.');
            let suffix = '';
            if (split.length > 1) {
                label = split[0];
                suffix = '.' + split[1];
            }

            do {
                label = prompt('Please specify a name (no duplicates)', label);
            } while (label && ctrl.getParent().getChild(label + suffix));

            if (label) {
                label += suffix;

                this.filesystem.rename(STORAGE_DIR, ctrl.getParent().getLabel(), ctrl.getLabel(), label, (result) => {
                    HC.log(result);
                    ctrl.rename(label);
                });

            }
        }
    }
}
