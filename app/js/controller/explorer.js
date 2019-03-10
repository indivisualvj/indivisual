(function () {
    var inst;

    HC.Explorer = function () {
        inst = this;
        this.gui = false;
        this.data = false;
    };

    HC.Explorer.prototype = {

        init: function () {

            this.data = {
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

            Vue.config.debug = DEBUG;
            Vue.directive('filter', function () {
                var data = this.vm.treeData;
                var sv = this.vm.searchValue;
                var reset = sv ? sv.length == 0 : true;

                function _search(_data) {
                    if (_data.root) {
                        _search(data.children);
                        return;
                    }

                    var found = false;
                    for (var k in _data) {
                        var _set = _data[k];
                        if (!_set.default) {

                            var ind = _set.name.indexOf(sv);
                            var match = ind > -1;

                            if (_set.type == 'folder') {
                                var src = (!reset && match) || _search(_set.children);
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

                _search(data);

            });
            Vue.component('itemtpl', {
                template: '#itemtpl',
                data: function () {
                    return {
                        open: false,
                        visible: true
                    }
                },
                computed: inst.computed,
                methods: inst.methods
            });

            this.gui = new Vue({
                el: '#root',
                data: {
                    treeData: this.data
                }
            });

            this.gui.$root._children[0].toggleFolder();
        },

        methods: {
            toggleFolder: function () {
                this.open = !this.open;
            },

            reload: function () {
                explorer.load();
            },

            loadPreset: function () {

                explorer.setPreset(statics.ControlSettings.layer, false);
                explorer.setPreset(statics.ControlSettings.layer, this.model);

                if (this.model.type == 'preset') { // load default
                    var dflt = statics.AnimationSettings.defaults().prepare();
                    requestAnimationFrame(function () {
                        controller.preset(false, dflt);
                    });

                } else { // load preset
                    messaging.load(STORAGE_DIR, this.model.dir, this.model.name, function (data) {
                        requestAnimationFrame(function () {

                            if (statics.ctrlKey) { //load shaders into present presets
                                controller.shaders(data.dir + '/' + data.name, JSON.parse(data.contents));

                            } else { // load the preset

                                HC.clearLog();

                                var key = data.dir + '/' + data.name;
                                var contents = JSON.parse(data.contents);
                                if (contents.tutorial && Object.keys(contents.tutorial).length) {
                                    new HC.ScriptProcessor(key, Object.create(contents.tutorial)).log();
                                }
                                controller.preset(key, contents);
                                explorer.setLoaded(statics.ControlSettings.layer, true);
                            }
                        });
                    });
                }
            },

            loadPresets: function () {
                var children = this.model.children;
                var dflt = [];

                for (var i = 0; dflt.length < layers.length && i < children.length; i++) {
                    var child = children[i];
                    if (!child.name.match(/^_.+/)) {
                        dflt.push(child);
                    }
                }

                if (!statics.shiftKey) {
                    explorer.resetPresets();
                }

                var di = 0;

                HC.clearLog();

                for (var i = 0; i < layers.length; i++) {
                    if (statics.shiftKey) { // shift means append presets to free layers. no overwrite.
                        if ((i in layers)
                            && layers[i].settings
                            && !layers[i].settings.isDefault()
                        ) {
                            continue;
                        }
                    }

                    if (!layerShuffleable(i)) {
                        continue;
                    }

                    if (di < dflt.length) {

                        var load = function (child, i, di) {

                            explorer.setPreset(i, child);

                            messaging.load(STORAGE_DIR, child.dir, child.name, function (data) {

                                requestAnimationFrame(function () {

                                    controller.updateControl('layer', i, true, true);
                                    controller.preset(data.dir + '/' + data.name, JSON.parse(data.contents));

                                    if (di == dflt.length - 1) {
                                        controller.updateControl('layer', 0, true, true);
                                    }
                                });
                            });
                        };

                        load(dflt[di], i, di++);

                    } else {
                        controller.preset('default', statics.AnimationSettings.initial, i);
                        //break;
                    }
                }
            },

            savePresets: function () {

                var model = this.model;

                for (var i = 0; i < model.children.length; i++) {
                    var child = model.children[i];
                    var layer = child.layer - 1;

                    if (layer >= 0 && child.changed) {
                        var save = function (layer, child) {
                            var settings = layers[layer].settings.prepare();
                            statics.AnimationSettings.clean(settings, statics.AnimationSettings.initial);
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

                var model = this.model;

                var settings = statics.AnimationSettings.prepare();
                statics.AnimationSettings.clean(settings, statics.AnimationSettings.initial);
                messaging.save(STORAGE_DIR, this.model.dir, this.model.name, settings, function (result) {
                    HC.log(result);
                    explorer.setPreset(statics.ControlSettings.layer, false);
                    explorer.setPreset(statics.ControlSettings.layer, model);
                    explorer.setLoaded(statics.ControlSettings.layer, true);

                });
            },

            deletePreset: function () {
                var current = this;
                var parent = current.$parent;

                messaging.delete(STORAGE_DIR, this.model.dir, this.model.name, function (result) {
                    HC.log(result);
                    parent.model.children.splice(current.$index, 1);
                });
            },

            renameItem: function () {
                var current = this;

                var name = current.model.name;
                var split = name.split('.');
                var suffix = '';
                if (split.length > 1) {
                    name = split[0];
                    suffix = '.' + split[1];
                }
                var input = prompt('Please specify a name', name);
                if (input) {
                    name = input;
                    if (suffix) {
                        name += suffix;
                    }

                } else {
                    return;
                }

                messaging.rename(STORAGE_DIR, this.model.dir, this.model.name, name, function (result) {
                    HC.log(result);
                    var children = current.model.children;
                    var odir = current.model.name;
                    for (var i = 0; i < children.length; i++) {
                        var dir = children[i].dir;
                        dir = dir.slice(-0, -odir.length);
                        children[i].dir = dir + name;
                    }
                    current.model.name = name;
                });
            },

            newPreset: function () {

                var model = this.model;

                var name = model.children.length;

                var input = prompt('Please specify a name', name);
                if (input) {
                    name = input;

                } else {
                    return;
                }

                var nu = {
                    type: 'file',
                    loaded: false,
                    layer: '',
                    changed: '',
                    dir: model.name,
                    name: name + '.json',
                    settings: statics.AnimationSettings.prepare(),
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
                var model = this.model;
                var name = '__NEW__';

                var input = prompt('Please specify a name', name);
                if (input) {
                    name = input;

                } else {
                    return;
                }

                var nu = {
                    type: 'folder',
                    dir: '',
                    name: name,
                    visible: true,
                    children: []
                };
                messaging.mkdir(STORAGE_DIR, name, false, function (result) {
                    HC.log(result);
                    model.children.unshift(nu);
                });
            }
        },

        computed: {
            isRoot: function () {
                return this.model.root;
            },
            isFolder: function () {
                return this.model.type == 'folder';
            },
            isPreset: function () {
                return this.model.type != 'folder';
            },
            isFile: function () {
                return this.model.type == 'file';
            },
            isLoaded: function () {
                return this.model.loaded;
            },
            hasChanged: function () {
                return this.model.layer && this.model.changed;
            },
            isVisible: function () {
                return this.model.visible;
            },
            isDefault: function () {
                return this.model.default;
            }
        },

        load: function () {
            messaging.files(STORAGE_DIR, function (data) {
                var dflt = inst.data.children[0];
                var tree = [dflt];

                for (var i = 0; data && i < data.length; i++) {
                    var file = data[i];
                    tree.push(file);
                }
                inst.data.children = tree;
            });
        },

        // update: function (data) {
        //
        //     var dflt = this.data.children[0];
        //     var tree = [dflt];
        //
        //     for (var i = 0; data && i < data.length; i++) {
        //         var file = data[i];
        //         tree.push(file);
        //     }
        //     this.data.children = tree;
        // },

        setPreset: function (layer, model) {
            var l = sm.get(layer);
            if (model) {
                model.layer = layer + 1;
                model.loaded = false;
                model.changed = '';

            } else if (l._preset) {
                l._preset.loaded = false;
                l._preset.changed = '';
                l._preset.layer = '';
            }
            l._preset = model;
        },

        resetPresets: function () {
            for (var i = 0; i < layers.length; i++) {
                this.setPreset(i, false);
            }
        },

        setChanged: function (layer, changed) {
            var l = sm.get(layer);
            if (l._preset) {
                if (changed) {
                    l._preset.changed = '*';

                } else {
                    l._preset.changed = '';
                }
            }
        },

        setLoaded: function (layer, loaded) {
            var l = sm.get(layer);
            if (l._preset) {
                l._preset.loaded = loaded;
            }
        },

        resetLoaded: function () {
            for (var i = 0; i < layers.length; i++) {
                this.setLoaded(i, false);
            }
        }

    };
})();