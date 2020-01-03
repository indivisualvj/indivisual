/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.Explorer}
     */
    HC.Explorer = class Explorer {
        data = {
            name: 'presets',
            type: 'folder',
            root: true,
            visible: true,
            children: [
                {
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
                }
            ]
        };

        /**
         *
         */
        init() {
            Vue.config.debug = DEBUG;
            Vue.component('item', {
                template: '#itemtpl',
                props: {
                    item: Object
                },
                data() {
                    return {
                        open: false,
                        visible: true
                    }
                },
                computed: HC.Explorer.VueItemComputed,
                methods: HC.Explorer.VueItemMethods
            });

            let gui = new Vue({
                el: '#root',
                data: {
                    treeData: this.data,
                    searchValue: '',
                    searchTimeout: false
                },
                methods: HC.Explorer.VueMethods
            });

            if (gui.$root.$children.length > 0) {
                gui.$root.$children[0].toggleFolder();
            }
        }

        /**
         * 
         */
        load() {
            messaging.files(STORAGE_DIR, (data) => {
                let dflt = this.data.children[0];
                let tree = [dflt];

                for (let i = 0; data && i < data.length; i++) {
                    let file = data[i];
                    tree.push(file);
                }
                this.data.children = tree;
            });
        }

        /**
         * 
         * @param layer
         * @param model
         */
        setPreset(layer, model) {
            let l = cm.getLayer(layer);
            if (model) {
                model.layer = layer + 1;
                model.loaded = false;
                model.changed = '';

            } else if (l._preset) {
                l._preset.loaded = false;
                l._preset.changed = '';
                l._preset.layer = '';
            }
            l._preset = model; // todo find better way to store preset info
        }

        /**
         * 
         */
        resetPresets() {
            for (let i = 0; i < cm.layers.length; i++) {
                this.setPreset(i, false);
            }
        }

        /**
         * 
         * @param layer
         * @param changed
         */
        setChanged(layer, changed) {
            let l = cm.getLayer(layer);
            if (l._preset) {
                if (changed) {
                    l._preset.changed = '*';

                } else {
                    l._preset.changed = '';
                }
            }
        }

        /**
         * 
         * @param layer
         * @param loaded
         */
        setLoaded(layer, loaded) {
            let l = cm.getLayer(layer);
            if (l._preset) {
                l._preset.loaded = loaded;
            }
        }

        /**
         * 
         */
        resetLoaded() {
            for (let i = 0; i < cm.layers.length; i++) {
                this.setLoaded(i, false);
            }
        }
    }
}

{
    /**
     *
     * @type {{filterTree: HC.Explorer.VueMethods.filterTree}}
     */
    HC.Explorer.VueMethods = {
        filterTree: function (event) {
            let data = this.treeData;
            let sv = this.searchValue;
            let reset = sv ? sv.length == 0 : true;

            function _search(_data) {
                if (_data.root) {
                    _search(data.children);
                    return;
                }

                let found = false;
                for (let k in _data) {
                    let _set = _data[k];
                    if (!_set.default) {

                        let ind = _set.name.indexOf(sv);
                        let match = ind > -1;

                        if (_set.type == 'folder') {
                            let src = (!reset && match) || _search(_set.children);
                            if (reset || src) {
                                _set.visible = true;
                                found = true;
                            } else {
                                _set.visible = false;
                            }

                        } else if (match) {
                            found = true;
                        }
                    }
                }
                return found;
            }

            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            this.searchTimeout = setTimeout(() => {
                _search(data);
            }, 500);
        }
    };

    /**
     *
     *
     */
    HC.Explorer.VueItemMethods = {
        toggleFolder: function () {
            this.open = !this.open;
        },

        reload: function () {
            explorer.load();
        },

        loadPreset: function () {
// todo PresetManager?
            explorer.setPreset(statics.ControlSettings.layer, false);
            explorer.setPreset(statics.ControlSettings.layer, this.item);

            if (this.item.type == 'preset') {
                // load default
                cm.setLayerProperties(statics.ControlSettings.layer, false);
                requestAnimationFrame(function () {
                    controller.updatePreset(false, cm.prepareLayer(statics.ControlSettings.layer));
                });

            } else {
                // load preset
                messaging.load(STORAGE_DIR, this.item.dir, this.item.name, function (data) {
                    requestAnimationFrame(function () {

                        if (statics.ctrlKey) { //load shaders into present presets
                            controller.shaders(data.dir + '/' + data.name, JSON.parse(data.contents));

                        } else {
                            // load the preset

                            HC.clearLog();

                            let key = data.dir + '/' + data.name;
                            let contents = JSON.parse(data.contents);

                            if (contents.info && contents.info.tutorial && Object.keys(contents.info.tutorial).length) {
                                new HC.ScriptProcessor(key, Object.create(contents.info.tutorial)).log();
                            }
                            controller.updatePreset(key, contents);
                            explorer.setLoaded(statics.ControlSettings.layer, true);
                        }
                    });
                });
            }
        },

        loadPresets: function () {
            let children = this.item.children;
            let dflt = [];

            for (let i = 0; dflt.length < cm.layers.length && i < children.length; i++) {
                let child = children[i];
                if (!child.name.match(/^_.+/)) {
                    dflt.push(child);
                }
            }

            if (!statics.shiftKey) {
                explorer.resetPresets();
            }

            let di = 0;

            HC.clearLog();

            for (let i = 0; i < cm.layers.length; i++) {
                if (statics.shiftKey) { // shift means append presets to free layers. no overwrite.
                    if ((i in cm.layers)
                        && cm.layers[i].controlsets
                        && cm.isDefault(i)
                    ) {
                        continue;
                    }
                }

                if (!layerShuffleable(i)) {
                    continue;
                }

                if (di < dflt.length) {

                    let load = function (child, i, di) {

                        explorer.setPreset(i, child);

                        messaging.load(STORAGE_DIR, child.dir, child.name, function (data) {

                            requestAnimationFrame(function () {

                                controller.updateControl('layer', i, true, true);
                                let key = data.dir + '/' + data.name;
                                let contents = JSON.parse(data.contents);
                                controller.updatePreset(key, contents);

                                if (di == dflt.length - 1) {
                                    controller.updateControl('layer', 0, true, true);
                                }
                            });
                        });
                    };

                    load(dflt[di], i, di++);

                } else {
                    cm.setLayerProperties(i, false);
                    controller.updatePreset('default', cm.prepareLayer(i), i);
                }
            }
        },

        savePresets: function () {

            let model = this.item;

            for (let i = 0; i < model.children.length; i++) {
                let child = model.children[i];
                let layer = child.layer - 1;

                if (layer >= 0 && child.changed) {
                    let save = function (layer, child) {
                        let settings = cm.getLayerProperties(layer);
                        messaging.save(STORAGE_DIR, child.dir, child.name, settings, function (result) {
                            HC.log(result);
                            explorer.setChanged(layer, false);
                        }, '');
                    };

                    save(layer, child);
                }
            }
        },

        savePreset: function () {

            let model = this.item;

            // let settings = statics.AnimationSettings.prepare();
            // statics.AnimationSettings.clean(settings, statics.AnimationSettings.initial);
            let settings = cm.getLayerProperties(statics.ControlSettings.layer);
            messaging.save(STORAGE_DIR, this.item.dir, this.item.name, settings, function (result) {
                HC.log(result);
                explorer.setPreset(statics.ControlSettings.layer, false);
                explorer.setPreset(statics.ControlSettings.layer, model);
                explorer.setLoaded(statics.ControlSettings.layer, true);

            });
        },

        deletePreset: function () {
            messaging.delete(STORAGE_DIR, this.item.dir, this.item.name, (result) => {
                HC.log(result);
                let ind = this.$parent.item.children.indexOf(this.item);
                this.$parent.item.children.splice(ind, 1);
            });
        },

        renameItem: function () {
            let name = this.item.name;
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

            messaging.rename(STORAGE_DIR, this.item.dir, this.item.name, name, (result) => {
                HC.log(result);
                let children = this.item.children;
                let odir = this.item.name;
                for (let i = 0; i < children.length; i++) {
                    let dir = children[i].dir;
                    dir = dir.slice(-0, -odir.length);
                    children[i].dir = dir + name;
                }
                this.item.name = name;
            });
        },

        newPreset: function () {

            let model = this.item;

            let name = model.children.length;

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
                dir: model.name,
                name: name + '.json',
                settings: cm.getLayerProperties(statics.ControlSettings.layer),
                children: []
            };

            messaging.save(STORAGE_DIR, nu.dir, nu.name, nu.settings, function (result) {
                HC.log(result);
                model.children.unshift(nu);
                explorer.setPreset(statics.ControlSettings.layer, false);
                explorer.setPreset(statics.ControlSettings.layer, nu);
                explorer.setLoaded(statics.ControlSettings.layer, true);
            }, '');
        },

        newFolder: function () {
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
                this.item.children.splice(1, 0, nu);
            });
        }
    };

    /**
     *
     * @type {{isFolder: (function(): boolean), isDefault: (function(): (boolean|Array|*)), isRoot: (function(): (boolean|Node|Element)), isFile: (function(): boolean), hasChanged: (function(): (string|number|*)), isPreset: (function(): boolean), isVisible: (function(): *), isLoaded: (function(): (boolean|number|*))}}
     */
    HC.Explorer.VueItemComputed = {
        isRoot: function () {
            return this.item.root;
        },
        isFolder: function () {
            return this.item.type == 'folder';
        },
        isPreset: function () {
            return this.item.type != 'folder';
        },
        isFile: function () {
            return this.item.type == 'file';
        },
        isLoaded: function () {
            return this.item.loaded;
        },
        hasChanged: function () {
            return this.item.layer && this.item.changed;
        },
        isVisible: function () {
            return this.item.visible;
        },
        isDefault: function () {
            return this.item.default;
        }
    };
}