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
         * @type {HC.Controller}
         */
        owner;

        statics;

        /**
         *
         * @param owner
         * @param settings
         */
        constructor(owner, settings) {
            this.owner = owner; // todo use it!
            this.statics = settings; // todo use it!

            this.init();
            this.load();
        }

        /**
         *
         */
        init() {
            Vue.config.debug = DEBUG;
            Vue.component('item', {
                template: '#itemtpl',
                owner: this.owner,
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
            for (let i = 0; i < this.statics.ControlValues.layer.length; i++) {
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
            controller.explorer.load();
        },

        loadPreset: function () {
            controller.presetman.loadPreset(this);
        },

        loadPresets: function () {
            controller.presetman.loadPresets(this);
        },

        savePresets: function () {
            controller.presetman.savePresets(this);
        },

        savePreset: function () {
            controller.presetman.savePreset(this);
        },

        deletePreset: function () {
            controller.presetman.deletePreset(this);
        },

        renameItem: function () {
            controller.presetman.renameItem(this);
        },

        newPreset: function () {
            controller.presetman.newPreset(this);
        },

        newFolder: function () {
            controller.presetman.newFolder(this);
        }
    };

    /**
     *
     * @type {{isFolder: (function(): boolean), isDefault: (function(): *), isRoot: (function(): boolean|Node|Element), isFile: (function(): boolean), hasChanged: (function(): *|string), isPreset: (function(): boolean), isVisible: (function(): *), isLoaded: (function(): boolean|number)}}
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
