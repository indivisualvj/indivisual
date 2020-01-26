/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.PresetManager = class PresetManager {

        /**
         * @type {HC.Explorer}
         */
        explorer;

        /**
         * @type {HC.Messaging}
         */
        filesystem;

        /**
         * 
         * @param {HC.Explorer} explorer
         * @param {HC.Messaging} filesystem
         */
        constructor(explorer, filesystem) {
            this.explorer = explorer;
            this.filesystem = filesystem;
        }

        /**
         *
         * @param {HC.GuifyExplorerPreset} ctrl
         */
        loadPreset(ctrl) {
            if (ctrl.getLabel() == '_default') {
                // load default
                cm.setLayerProperties(statics.ControlSettings.layer, false);
                requestAnimationFrame(() => {
                    this.explorer.resetPreset(statics.ControlSettings.layer + 1);
                    this.explorer.controller.updatePreset(false, cm.prepareLayer(statics.ControlSettings.layer));
                });

            } else {
                // load preset
                this.filesystem.load(STORAGE_DIR, ctrl.getParent().getLabel(), ctrl.getLabel(), (data) => {
                    requestAnimationFrame(() => {

                        if (statics.ctrlKey) { //load shaders into present presets
                            this.explorer.controller.transferShaderPasses(data.dir + '/' + data.name, JSON.parse(data.contents));

                        } else {
                            // load the preset

                            HC.clearLog();

                            let key = data.dir + '/' + data.name;
                            let contents = JSON.parse(data.contents);

                            this.explorer.controller.updatePreset(key, contents);
                            let layer = statics.ControlSettings.layer + 1;
                            this.explorer.resetPreset(layer);
                            ctrl.setInfo(layer);
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
            let dflt = [];
            let layers = statics.ControlValues.layer;

            for (let i = 0; dflt.length < layers.length && i < children.length; i++) {
                let child = folder.getChild(children[i]);
                if (!child.getLabel().match(/^_.+/)) {
                    dflt.push(child);
                }
            }
            this.explorer.resetPresets();

            HC.clearLog();

            let di = 0;
            for (let i = 0; i < layers.length; i++) {
                if (!layerShuffleable(i)) {
                    continue;
                }

                if (di < dflt.length) {
                    this._loadPreset(dflt[di], i, di, di == dflt.length - 1);
                    di++;

                } else {
                    this.explorer.controller.updatePreset(false, cm.prepareLayer(statics.ControlSettings.layer));
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
            let layers = statics.ControlValues.layer;

            for (let i = 0; dflt.length < layers.length && i < children.length; i++) {
                let child = folder.getChild(children[i]);
                if (!child.getLabel().match(/^_.+/)) {
                    dflt.push(child);
                }
            }

            HC.clearLog();

            let di = 0;
            for (let i = 0; i < layers.length; i++) {
                if (!cm.isDefault(i)) {
                    continue;
                }
                if (!layerShuffleable(i)) {
                    continue;
                }

                if (di < dflt.length) {
                    this._loadPreset(dflt[di], i, di, di == dflt.length - 1);
                    di++;

                } else {
                    this.explorer.controller.updatePreset(false, cm.prepareLayer(statics.ControlSettings.layer));
                }
            }
        }

        /**
         *
         * @param {HC.GuifyExplorerPreset} child
         * @param i
         * @param di
         * @private
         */
        _loadPreset(child, i, di, last) {

            child.setInfo(i+1);

            this.filesystem.load(STORAGE_DIR, child.getParent().getLabel(), child.getLabel(), (data) => {

                requestAnimationFrame(() => {

                    this.explorer.controller.updateControl('layer', i, true, true); // todo why have to set?
                    let key = data.dir + '/' + data.name;
                    let contents = JSON.parse(data.contents);
                    this.explorer.controller.updatePreset(key, contents);

                    if (last) {
                        this.explorer.controller.updateControl('layer', 0, true, true);
                    }
                });
            });
        };

        /**
         *
         * @param {HC.GuifyExplorerFolder} ctrl
         */
        savePresets(ctrl) {
            for (let k in ctrl.children) {
                let child = ctrl.children[k];
                let layer = parseInt(child.getInfo()) - 1;

                if (layer >= 0 && child.getChanged()) {
                    let save = (layer, child) => {
                        let settings = cm.prepareLayer(layer);
                        this.filesystem.save(STORAGE_DIR, ctrl.getLabel(), child.getLabel(), settings, (result) => {
                            HC.log(result);
                            child.setInfo(null);
                        }, '');
                    };

                    save(layer, child);
                }
            }
        }

        /**
         *
         * @param {HC.GuifyExplorerPreset} ctrl
         */
        savePreset(ctrl) {
            let settings = cm.prepareLayer(statics.ControlSettings.layer);
            this.filesystem.save(STORAGE_DIR, ctrl.getParent().getLabel(), ctrl.getLabel(), settings, (result) => {
                HC.log(result);
                ctrl.setChanged(null);
            });
        }

        /**
         *
         * @param {HC.GuifyExplorerFolder} ctrl
         */
        newPreset(ctrl) {
            let name = Object.keys(ctrl.children).length.toString();

            let input = prompt('Please specify a name', name);
            if (input) {
                name = input;
                let nu = {
                    type: 'file',
                    dir: ctrl.getLabel(),
                    name: name + '.json',
                    settings: cm.prepareLayer(statics.ControlSettings.layer)
                };

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
        deletePreset(ctrl) {
            this.filesystem.delete(STORAGE_DIR, ctrl.getParent().getLabel(), ctrl.getLabel(), (result) => {
                HC.log(result);
                ctrl.remove();
            });
        }

        /**
         *
         * @param {HC.GuifyExplorer} ctrl
         */
        newFolder(ctrl) {
            let name = '__NEW__';

            let input = prompt('Please specify a name', name);
            if (input) {
                name = input;
                this.filesystem.mkdir(STORAGE_DIR, name, false, (result) => {
                    HC.log(result);
                    ctrl.addFolder(name);
                });
            }
        }

        /**
         *
         * @param {HC.GuifyItem} ctrl
         */
        renameItem(ctrl) {
            let name = ctrl.getLabel();
            let split = name.split('.');
            let suffix = '';
            if (split.length > 1) {
                name = split[0];
                suffix = '.' + split[1];
            }
            let input = prompt('Please specify a name', name);
            if (input) {
                name = input;
                if (suffix) {
                    name += suffix;
                }
                this.filesystem.rename(STORAGE_DIR, ctrl.getParent().getLabel(), ctrl.getLabel(), name, (result) => {
                    HC.log(result);
                    ctrl.setLabel(name);
                });

            }
        }
    }
}
