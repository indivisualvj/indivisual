/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import {TimeoutManager} from "../manager/TimeoutManager";
import {Messaging} from "../shared/Messaging";
import {PresetUi} from "./ui/PresetUi";
import {ScriptProcessor} from "./ScriptProcessor";
import {LayeredControlSetManager} from "../manager/LayeredControlSetManager";
import {Logger} from "../shared/Logger";

class PresetManager {

    /**
     * @type {Controller}
     */
    controller;

    /**
     * @type {Config}
     */
    config;

    /**
     * @type {PresetUi}
     */
    gui;

    /**
     * @type {LayeredControlSetManager}
     */
    settingsManager;


    /**
     *
     * @type {Array}
     */
    default = {
        name: '_default',
        type: 'folder',
        default: true,
        visible: true,
        children: [
            {
                name: '_default',
                type: 'preset',
                default: true
            }
        ]
    };

    /**
     *
     * @param id
     * @param title
     * @param {Controller}controller
     */
    constructor(id, title, controller) {
        this.gui = new PresetUi(id, title, true, {
            create: () => {
                this._createFolder(this.gui);
            },
            reload: () => {
                this.reload();
            }
        });
        this.controller = controller;
        this.settingsManager = controller.settingsManager;
        this.config = controller.config;
    }

    /**
     *
     * @param {Preset} ctrl
     * @param {boolean} loadShaders
     * @private
     */
    _loadPreset(ctrl, loadShaders) {
        let layer = this.config.ControlSettings.layer;
        if (ctrl.getLabel() === '_default') {
            // load default
            TimeoutManager.add('loadPreset', 0, () => {
                this.gui.resetLayerStatus(layer+1);
                this.settingsManager.resetLayer(layer);
                this._updatePreset(false, {}, layer); // case reset
            });

        } else {
            //load shaders into present presets
            if (loadShaders) {
                Messaging.load(STORAGE_DIR, ctrl.getParent().getLabel(), ctrl.getLabel(), (data) => {
                    this._transferShaderPasses(data.dir + '/' + data.name, JSON.parse(data.contents)).finally();
                });

            } else {
                // load the preset
                this._doLoadPreset(ctrl, layer, () => {
                    this.setSelected(layer+1, true);
                });
            }
        }
    }

    /**
     *
     * @param folder
     * @param append
     * @returns {Promise<unknown>}
     * @private
     */
    _loadPresets(folder, append) {

        return new Promise((resolve, reject) => {

            let children = Object.keys(folder.children);
            let candidates = [];

            for (let layer = 0; candidates.length < this.config.ControlValues.layers && layer < children.length; layer++) {
                let child = folder.getChild(children[layer]);
                candidates.push(child);
            }

            let candidate = 0;
            let calls = [];
            for (let layer = 0; layer < this.config.ControlValues.layers; layer++) {
                let defaultOnly = true === append ? this.settingsManager.isDefault(layer) : true;

                if (defaultOnly && this.config.shuffleable(layer + 1)) {
                    if (candidate < candidates.length) {
                        let child = candidates[candidate];
                        this.settingsManager.resetLayer(layer);
                        calls.push((_loaded) => {
                            TimeoutManager.add('loadPresets.' + layer, SKIP_TEN_FRAMES, () => {
                                this._doLoadPreset(child, layer, _loaded);
                            });
                        });
                        candidate++;

                    } else { // always reset but do it slowly
                        calls.push((_synced) => {
                            TimeoutManager.add('loadPresets.' + layer, SKIP_TEN_FRAMES, () => {
                                this.controller.resetLayer(layer, _synced);
                                this.gui.resetLayerStatus(layer+1);
                            });
                        });
                    }
                }
            }

            TimeoutManager.chainExecuteCalls(calls, resolve);
        });
    }

    /**
     *
     * @param child
     * @param layer
     * @param callback
     * @private
     */
    _doLoadPreset(child, layer, callback) {

        console.log('loading', child.getLabel());
        Messaging.load(STORAGE_DIR, child.getParent().getLabel(), child.getLabel(), (data) => {
            let key = data.dir + '/' + data.name;
            let contents = JSON.parse(data.contents);
            console.log('loaded', data.name);
            this.gui.resetLayerStatus(layer+1);
            child.setInfo(layer+1);
            this._updatePreset(key, contents, layer, callback); // case actually load data
        });
    };

    /**
     *
     * @param ctrl
     * @private
     */
    _savePresets(ctrl) {
        let confirmed = confirm('Save all?');
        if (confirmed) {
            for (let k in ctrl.children) {
                let child = ctrl.children[k];
                let layer = parseInt(child.getInfo()) - 1;

                if (layer >= 0 && child.getChanged()) {
                    let save = (layer, child) => {
                        let settings = this.settingsManager.prepareLayer(layer);
                        Messaging.save(STORAGE_DIR, ctrl.getLabel(), child.getLabel(), settings, (result) => {
                            Logger.log(result);
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
     * @param name
     * @param data
     * @param layer
     * @param [_emitted]
     * @private
     */
    _updatePreset(name, data, layer, _emitted) {
        Logger.log('preset', name);

        this.settingsManager.resetLayer(layer);

        if (data && !('info' in data)) {
            this.updateMigrateSettings0(layer, data);
            this.controller.updateSettings(layer, this.settingsManager.prepareLayer(layer), false, false, true);

            // example!
            // } else if ('info' in data && data.info.version > 1.99) {
            // this.updateMigrateSettings1(layer, data, true, false, true);

        } else if (data) {
            this.controller.updateSettings(layer, data, false, false, true);
            this.settingsManager.update(layer, 'info', 'name', name);
        }

        data = this.settingsManager.prepareLayer(layer);
        if (this.settingsManager.get(layer, 'info').hasTutorial()) {
            new ScriptProcessor(this, name, Object.create(data.info.tutorial)).log();
            data.info.tutorial = {};
        }

        Messaging.emitSettings(layer, data, false, false, true, _emitted);
    }

    /**
     *
     * @param name
     * @param data
     * @returns {Promise<unknown>}
     * @private
     */
    _transferShaderPasses(name, data) {
        return new Promise((resolve, reject) => {
            Logger.log('passes', name);
            let calls = [];
            for (let layer = 0; layer < this.config.ControlValues.layers; layer++) {
                if (this.config.shuffleable(layer+1) && !this.settingsManager.isDefault(layer)) {
                    calls.push((_synced) => {
                        TimeoutManager.add('transferShader.' + layer, SKIP_TWO_FRAMES, () => {
                            this._appendShaderPasses(layer, data);
                            this.gui.setChanged(layer+1, true);
                            this.controller.updateUiPasses();
                            Logger.log('append_shaders', layer+1);
                            Messaging.emitSettings(layer, this.settingsManager.prepareLayer(layer), false, false, true, _synced);
                        });
                    });
                }
            }

            TimeoutManager.chainExecuteCalls(calls, resolve);
        });
    }

    /**
     *
     * @param layer
     * @param data
     * @private
     */
    _appendShaderPasses(layer, data) {
        if (!('info' in data)) {
            let shaders = {shaders: data.shaders};
            this.updateMigrateSettings0(layer, shaders);

            // example!
            // } else if ('info' in data && data.info.version > 1.99) {
            // this.updateMigrateSettings1(layer, data, true, false, true);

        } else {
            let newShaders = data.passes.shaders;
            let controlSet = this.settingsManager.get(layer, 'passes');

            for (let key in newShaders) {
                controlSet.addShaderPass(newShaders[key]);
            }
        }
    }

    /**
     * Given layer actually gets updated here.
     *
     * @param layer
     * @param data
     */
    updateMigrateSettings0(layer, data) {
        let mappings = LayeredControlSetManager.mappings(() => {return LayeredControlSetManager.initAll(this.config.AnimationValues);});
        let controlSet = this.settingsManager.get(layer, 'passes');

        for (let k in data) {
            let value = data[k];
            if (k === 'shaders' || k === 'passes') {
                // sort shaders by index
                delete value._template;
                delete value.isdefault;
                delete value.initial;
                let keys = Object.keys(value);
                keys.sort(function (a, b) {
                    let ia = value[a].index;
                    let ib = value[b].index;

                    return ia - ib;
                });

                for (let key in keys) {
                    let name = keys[key];
                    let sh = value[name];
                    if (sh.apply) {
                        delete sh.index;
                        let pass = {};
                        pass[name] = sh;
                        controlSet.addShaderPass(pass);
                    }
                }
            } else {
                let set = mappings[k];
                if (set) {
                    this.settingsManager.update(layer, set, k, value);
                }
            }
        }
    }

    /**
     *
     */
    restoreLoadedPresets() {
        for (let layer = 0; layer < this.config.ControlValues.layers; layer++) {
            let name = this.settingsManager.get(layer, 'info').get('name');
            if (name) {
                this.gui.setInfoByPath(name, layer+1);
            }
        }
    }

    /**
     *
     * @param {GuifyExplorerPreset} ctrl
     * @private
     */
    _savePreset(ctrl) {
        let settings = this.settingsManager.prepareLayer(this.config.ControlSettings.layer);
        let dir = ctrl.getParent().getLabel();
        let label = ctrl.getLabel();
        settings.info.name = HC.filePath(dir, label);

        Messaging.save(STORAGE_DIR, dir, label, settings, (result) => {
            Logger.log(result);
            ctrl.setChanged(null);
        });
    }

    /**
     *
     * @param ctrl
     * @private
     */
    _newPreset(ctrl) {
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
            let opts = {
                type: 'file',
                dir: ctrl.getLabel(),
                name: label,
                settings: preset
            };

            preset.info.name = HC.filePath(opts.dir, opts.name);

            Messaging.save(STORAGE_DIR, opts.dir, opts.name, opts.settings, (result) => {
                Logger.log(result);
                this._addPreset(opts.name, ctrl);
            }, '');
        }
    }

    /**
     *
     * @param {GuifyExplorerPreset} ctrl
     * @private
     */
    _deleteFolder(ctrl) {
        let confirmed = confirm('Do you want to delete "' + ctrl.getLabel() + '"?');
        if (confirmed) {
            Messaging.delete(STORAGE_DIR, null, ctrl.getLabel(), (result) => {
                Logger.log(result);
                ctrl.removeFromParent();
            });
        }
    }

    /**
     *
     * @param parent
     * @private
     */
    _createFolder(parent) {
        let label = '__NEW__';

        do {
            label = prompt('Please specify a name (no duplicates)', label);
        } while (label && parent.getChild(label));

        if (label) {
            Messaging.mkdir(STORAGE_DIR, label, false, (result) => {
                Logger.log(result);
                this._addFolder(label, label, true);
            });
        }
    }

    /**
     *
     * @param parent
     * @param {string}label
     * @param {boolean}addActions
     * @returns {*}
     * @private
     */
    _addFolder(parent, label, addActions) {

        let opts = null;
        if (addActions) {
            opts = {
                create: (ctrl) => {
                    this._newPreset(ctrl);
                },
                fill: (ctrl) => {
                    this._loadPresets(ctrl, HC.Hotkey.isPressed('shift')).finally();
                },
                save: (ctrl) => {
                    this._savePresets(ctrl);
                },
                rename: (ctrl) => {
                    this._renameFolder(ctrl);
                },
                delete: (ctrl) => {
                    this._deleteFolder(ctrl);
                },
            }
        }

        let folder = this.gui.addFolder(label, label, false);
        folder.finishLayout(opts);

        return folder;
    }


    /**
     *
     * @param {string}label
     * @param {GuifyExplorerFolder}parent
     * @private
     */
    _addPreset(label, parent) {
        let opts = {
            type: 'button',
            label: label,
            action: (ctrl) => {
                this._loadPreset(ctrl, HC.Hotkey.isPressed('ctrl'));
            },
            save: (ctrl) => {
                this._savePreset(ctrl);
            },
            rename: (ctrl) => {
                this._renamePreset(ctrl);
            },
            delete: (ctrl) => {
                this._deletePreset(ctrl);
            }
        };

        this.gui.addPreset(label, parent, opts);
    }

    /**
     *
     * @param {GuifyExplorerPreset} ctrl
     * @private
     */
    _deletePreset(ctrl) {
        let confirmed = confirm('Do you want to delete "' + ctrl.getLabel() + '"?');
        if (confirmed) {
            Messaging.delete(STORAGE_DIR, ctrl.getParent().getLabel(), ctrl.getLabel(), (result) => {
                Logger.log(result);
                ctrl.removeFromParent();
            });
        }
    }

    /**
     *
     * @param ctrl
     * @private
     */
    _renameFolder(ctrl) {
        let label = ctrl.getLabel();

        do {
            label = prompt('Please specify a name (no duplicates)', label);
        } while (label && ctrl.getParent().getChild(label));

        if (label) {
            Messaging.rename(STORAGE_DIR, null, ctrl.getLabel(), label, (result) => {
                Logger.log(result);
                ctrl.rename(label);
            });

        }
    }

    /**
     *
     * @param {GuifyItem} ctrl
     * @private
     */
    _renamePreset(ctrl) {
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

            Messaging.rename(STORAGE_DIR, ctrl.getParent().getLabel(), ctrl.getLabel(), label, (result) => {
                Logger.log(result);
                ctrl.rename(label);
            });

        }
    }


    /**
     *
     * @param layer
     * @param changed
     */
    setChanged(layer, changed) {
        this.gui.setChanged(layer, changed);
    }

    /**
     *
     * @param layer
     * @param loaded
     */
    setSelected(layer, loaded) {
        this.gui.setSelected(layer, loaded);
    }

    /**
     *
     * @param excluded
     */
    resetStatus(excluded) {
        for (let layer = 0; layer < this.config.ControlValues.layers; layer++) {
            if (excluded && excluded.length) {
                if (excluded.indexOf(layer+1) > -1) {
                    continue;
                }
            }
            this.gui.resetLayerStatus(layer+1);
        }
    }

    reload() {
        this.gui.removeChildren();
        this._load();
    }

    /**
     *
     * @private
     */
    _load() {
        this._fetchPresets((data) => {
            let _insert = (children, parent) => {
                let calls = [];
                for (let k in children) {
                    let child = children[k];

                    if (child.type === 'folder') {
                        calls.push((_loaded) => {
                            TimeoutManager.add('gui.load.' + k, SKIP_ONE_FRAMES, () => {
                                let folder = this._addFolder(child.name, child.name, true);
                                _insert(child.children, folder);
                                _loaded();
                            });
                        });
                    } else {
                        this._addPreset(child.name, parent);
                    }
                }

                TimeoutManager.chainExecuteCalls(calls, () => {
                    this.restoreLoadedPresets();
                });
            };

            data.unshift(this.default);
            _insert(data, this.gui);
        });
    }


    /**
     *
     * @param callback
     * @private
     */
    _fetchPresets(callback) {
        Messaging.files(STORAGE_DIR, callback);
    }
}

export {PresetManager}