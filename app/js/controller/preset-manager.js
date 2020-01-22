/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.PresetManager = class PresetManager {

        /**
         * @type {HC.Controller}
         */
        owner;

        /**
         * 
         * @param owner
         */
        constructor(owner) {
            this.owner = owner;
        }

        /**
         *
         * @param item
         * @param ctrl
         */
        loadPreset(item, ctrl) {
            this.owner.explorer.setPreset(statics.ControlSettings.layer, false);
            this.owner.explorer.setPreset(statics.ControlSettings.layer, item);

            if (item.type == 'preset') {
                // load default
                cm.setLayerProperties(statics.ControlSettings.layer, false);
                requestAnimationFrame(() => {
                    this.owner.updatePreset(false, cm.prepareLayer(statics.ControlSettings.layer));
                });

            } else {
                // load preset
                messaging.load(STORAGE_DIR, item.dir, item.name, (data) => {
                    requestAnimationFrame(() => {

                        if (statics.ctrlKey) { //load shaders into present presets
                            this.owner.transferShaderPasses(data.dir + '/' + data.name, JSON.parse(data.contents));

                        } else {
                            // load the preset

                            HC.clearLog();

                            let key = data.dir + '/' + data.name;
                            let contents = JSON.parse(data.contents);

                            // if (contents.info && contents.info.tutorial && Object.keys(contents.info.tutorial).length) {
                            //     new HC.ScriptProcessor(key, Object.create(contents.info.tutorial)).log();
                            // }
                            this.owner.updatePreset(key, contents);
                            this.owner.explorer.setLoaded(statics.ControlSettings.layer, true);
                        }
                    });
                });
            }
        }

        /**
         *
         * @param item
         * @param ctrl
         */
        loadPresets(item, ctrl) {
            let children = item.children;
            let dflt = [];

            for (let i = 0; dflt.length < statics.ControlValues.layer.length && i < children.length; i++) {
                let child = children[i];
                if (!child.name.match(/^_.+/)) {
                    dflt.push(child);
                }
            }

            if (!statics.shiftKey) {
                this.owner.explorer.resetPresets();
            }

            let di = 0;

            HC.clearLog();

            for (let i = 0; i < statics.ControlValues.layer.length; i++) {
                if (statics.shiftKey) { // shift means append presets to free layers. no overwrite.
                    if (cm.isDefault(i)) {
                        continue;
                    }
                }

                if (!layerShuffleable(i)) {
                    continue;
                }

                if (di < dflt.length) {

                    let load = (child, i, di) => {

                        this.owner.explorer.setPreset(i, child);

                        messaging.load(STORAGE_DIR, child.dir, child.name, (data) => {

                            requestAnimationFrame(() => {

                                this.owner.updateControl('layer', i, true, true);
                                let key = data.dir + '/' + data.name;
                                let contents = JSON.parse(data.contents);
                                this.owner.updatePreset(key, contents);

                                if (di == dflt.length - 1) {
                                    this.owner.updateControl('layer', 0, true, true);
                                }
                            });
                        });
                    };

                    load(dflt[di], i, di++);

                } else {
                    cm.setLayerProperties(i, false);
                    this.owner.updatePreset('default', cm.prepareLayer(i), i);
                }
            }
        }

        /**
         *
         * @param item
         * @param ctrl
         */
        savePresets(item, ctrl) {
            for (let i = 0; i < item.children.length; i++) {
                let child = item.children[i];
                let layer = child.layer - 1;

                if (layer >= 0 && child.changed) {
                    let save = (layer, child) => {
                        let settings = cm.prepareLayer(layer);
                        messaging.save(STORAGE_DIR, child.dir, child.name, settings, (result) => {
                            HC.log(result);
                            this.owner.explorer.setChanged(layer, false);
                        }, '');
                    };

                    save(layer, child);
                }
            }
        }

        /**
         *
         * @param item
         * @param ctrl
         */
        savePreset(item, ctrl) {
            let settings = cm.prepareLayer(statics.ControlSettings.layer);
            messaging.save(STORAGE_DIR, item.dir, item.name, settings, (result) => {
                HC.log(result);
                this.owner.explorer.setPreset(statics.ControlSettings.layer, false);
                this.owner.explorer.setPreset(statics.ControlSettings.layer, item);
                this.owner.explorer.setLoaded(statics.ControlSettings.layer, true);

            });
        }

        /**
         *
         * @param item
         * @param ctrl
         */
        newPreset(item, ctrl) {
            let name = item.children.length;

            let input = prompt('Please specify a name', name);
            if (input) {
                name = input;

            } else {
                return;
            }

            let nu = {
                type: 'file',
                loaded: false,
                layer: '',
                changed: '',
                dir: item.name,
                name: name + '.json',
                settings: cm.prepareLayer(statics.ControlSettings.layer),
                children: []
            };

            messaging.save(STORAGE_DIR, nu.dir, nu.name, nu.settings, (result) => {
                HC.log(result);
                ctrl.addPreset(nu);
                this.owner.explorer.setPreset(statics.ControlSettings.layer, false);
                this.owner.explorer.setPreset(statics.ControlSettings.layer, nu);
                this.owner.explorer.setLoaded(statics.ControlSettings.layer, true);
            }, '');
        }

        /**
         *
         * @param item
         * @param ctrl
         */
        deletePreset(item, ctrl) {
            messaging.delete(STORAGE_DIR, item.dir, item.name, (result) => {
                HC.log(result);
                ctrl.remove();
            });
        }

        /**
         *
         * @param item
         * @param ctrl
         */
        newFolder(item, ctrl) {
            let name = '__NEW__';

            let input = prompt('Please specify a name', name);
            if (input) {
                name = input;

            } else {
                return;
            }

            let nu = {
                type: 'folder',
                dir: '',
                name: name,
                visible: true,
                children: []
            };
            messaging.mkdir(STORAGE_DIR, name, false, (result) => {
                HC.log(result);
                item.addFolder(name, false);
            });
        }

        /**
         *
         * @param item
         * @param ctrl
         */
        renameItem(item, ctrl) {
            let name = item.name;
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

            } else {
                return;
            }

            messaging.rename(STORAGE_DIR, item.dir, item.name, name, (result) => {
                HC.log(result);
                // todo rename folder/item? no remove and reload!
                let children = item.children;
                let odir = item.name;
                for (let i = 0; i < children.length; i++) {
                    let dir = children[i].dir;
                    dir = dir.slice(-0, -odir.length);
                    children[i].dir = dir + name;
                }
                item.name = name;
            });
        }
    }
}
