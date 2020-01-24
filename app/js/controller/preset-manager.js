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
            // fixme use attr observer to handle duplicate layer info

            if (ctrl.getLabel() == '_default') {
                // load default
                cm.setLayerProperties(statics.ControlSettings.layer, false);
                requestAnimationFrame(() => {
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
                            ctrl.setInfo(statics.ControlSettings.layer + 1);
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
            // fixme INSERT CODE!
        }

        /**
         *
         * @param {HC.GuifyExplorerFolder} folder
         */
        appendPresets(folder) {
            // fixme INSERT CODE!
        }

        /**
         *
         * @param {HC.GuifyExplorerFolder} ctrl
         */
        savePresets(ctrl) {
            for (let k in ctrl.children) {
                let child = ctrl.children[k];
                let layer = parseInt(child.getInfo()) - 1;

                if (layer >= 0 && child.getChanged()) { // fixme solution!
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
