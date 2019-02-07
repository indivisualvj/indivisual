/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

var messaging  = false;
var explorer   = false;
var controller = false;
var midi = false;
var beatkeeper = false;
var layers = false;
var sm = false;

/**
 *
 */
document.addEventListener('DOMContentLoaded', function () {

    onResize = function () {
        var columns = document.querySelectorAll('.left');
        var allover = document.body.clientHeight - 20;

        for (var i = 0; i < columns.length; i++) {
            var col = columns[i];

            // calcuclate heights of FH elements to figure out the rest
            var cells = col.querySelectorAll('.item.fh');
            var reserved = 0;
            var ii = 0;

            for (ii = 0; ii < cells.length; ii++) {
                reserved += cells[ii].clientHeight;
            }

            var spare = allover - reserved;

            cells = col.querySelectorAll('.item:not(.fh)');
            var cc = cells.length;

            for (ii = 0; ii < cells.length; ii++) {
                cells[ii].style.height = (spare / cc) + 'px';
            }
        }
    };

    window.addEventListener('resize', onResize);

    controller = new HC.Controller(G_INSTANCE);
    messaging = new HC.Messaging(controller);
    messaging.connect(function (reconnect) {

        document.getElementById(_MONITOR).setAttribute('src', 'monitor.html#' + messaging.sid);

        _log(controller.name, 'connected', true, true);

        if (!reconnect) {

            loadResources(resources, function () {

                layers = new Array(statics.ControlValues.layer.length);
                sm = new HC.SettingsManager(statics.AnimationSettings, layers);

                statics.ControlController = new HC.ControlController();
                statics.DisplayController = new HC.DisplayController();
                statics.SourceController = new HC.SourceController();

                controller.init();
                controller.addControllers(statics.ControlController,
                    statics.ControlSettings,
                    statics.ControlValues,
                    statics.ControlTypes,
                    function (ksub, value) {
                        controller.updateControl(ksub, value, true, true, false);
                    }
                );
                controller.addControllers(statics.DisplayController,
                    statics.DisplaySettings,
                    statics.DisplayValues,
                    statics.DisplayTypes,
                    function (ksub, value) {
                        controller.updateDisplay(ksub, value, true, true, false);
                    }
                );
                controller.addControllers(statics.SourceController,
                    statics.SourceSettings,
                    statics.SourceValues,
                    statics.SourceTypes,
                    function (ksub, value) {
                        controller.updateSource(ksub, value, true, true, false);
                    }
                );
                controller.addControllers(statics.AnimationController,
                    statics.AnimationSettings,
                    statics.AnimationValues,
                    statics.AnimationTypes,
                    function (ksub, value) {
                        controller.updateSetting(statics.ControlSettings.layer, ksub, value, true, true, false);
                    }, true
                );
                controller.addShaderControllers(function (v) {
                    controller.updateSetting(statics.ControlSettings.layer, 'shaders',
                        statics.AnimationSettings.shaders, true, true, false
                    );
                    _log(this.parent + '/' + this.label, v);
                });

                explorer = new HC.Explorer();
                explorer.init();
                explorer.load();

                beatkeeper = new HC.Beatkeeper();

                messaging.sync(function (data) {
                    controller.loadSession(data);
                });

                controller.initKeyboard();
                midi = controller.initMidi(controller);

                onResize();
            });
        }
    });
});

(function () {
    /**
     *
     * @param name
     * @constructor
     */
    HC.Controller = function (name) {
        this.name = name;
        this.gui = false;
        this.synced = {};
    };

    HC.Controller.prototype = {

        /**
         *
         */
        init: function () {
            this.gui = new dat.GUI({autoPlace: false});
            document.getElementById('controller').appendChild(this.gui.domElement);
        },

        /**
         *
         * @param session
         */
        loadSession: function (session) {

            if ('controls' in session) {
                _log('controls', 'synced');
                var controls = session.controls;
                this.updateControls(controls, true, false, true);
            }
            if ('displays' in session) {
                _log('displays', 'synced');
                var displays = session.displays;
                this.updateDisplays(displays, true, false, true);
            }
            if ('sources' in session) {
                _log('sources', 'synced');
                var sources = session.sources;
                this.updateSources(sources, true, false, true);
            }
            if ('settings' in session) {
                _log('settings', 'synced');
                var settings = session.settings;
                for (var k in settings) {
                    this.updateSettings(k, settings[k], true, false, true);
                }
            }
            if ('data' in session) {
                _log('data', 'synced');
                this.updateData();
            }

            this.updateControl('layer', statics.ControlSettings.layer, true, false, false);
        },

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateSettings: function (layer, data, display, forward, force) {

            if (force) {
                for (var k in data) {
                    var value = data[k];
                    sm.update(layer, k, value);
                }
                this.updateUi(false, false, false);

            } else {
                for (var k in data) {
                    var value = data[k];
                    this.updateSetting(layer, k, value, display, false, false);
                }
            }
        },

        /**
         *
         * @param folder
         * @param datasource
         */
        shareSettings: function (folder, datasource) {

            if (!datasource) {
                var keys = Object.keys(statics.AnimationController[folder]);
                var settings = {};

                for (var i = 0; i < keys.length; i++) {
                    settings[keys[i]] = statics.AnimationSettings[keys[i]];
                }

            } else {
                settings = {};
                settings[folder] = statics.AnimationSettings[folder];
            }

            for (var i = 0; i < layers.length; i++) {
                if (i != statics.ControlSettings.layer
                    && (i in layers)
                    && layers[i].settings
                    && !layers[i].settings.isDefault()
                    && layerShuffleable(i) == layerShuffleable(statics.ControlSettings.layer)
                ) {
                    this.updateSettings(i, settings, true, true, true);

                    if (layers[i]._preset) {
                        explorer.setChanged(i, true);
                    }

                   messaging.emitSettings(i, settings, false, false, true);
                }
            }
        },

        /**
         *
         * @param item
         * @param value
         */
        shareSetting: function (item, value) {
            var data = {};
            data[item] = value;

            for (var i = 0; i < layers.length; i++) {
                if (i != statics.ControlSettings.layer
                    && (i in layers)
                    && layers[i].settings
                    && !layers[i].settings.isDefault()
                    && layerShuffleable(i) == layerShuffleable(statics.ControlSettings.layer)
                ) {

                    this.updateSettings(i, data, true, true, true);

                    if (layers[i]._preset) {
                        explorer.setChanged(i, true);
                    }

                    messaging.emitSettings(i, data, false, false, true);
                }
            }
        },

        /**
         *
         * @param dir
         * @param value
         */
        setSynchronized: function (dir, value) {

            for (var key in statics.AnimationController[dir]) {
                this.synced[key] = value;
            }

        },

        /**
         *
         * @param data
         * @param display
         * @param forward (notused)
         * @param force
         */
        updateControls: function (data, display, forward, force) {

            if (force) {
                for (var k in data) {
                    var value = data[k];
                    statics.ControlSettings.update(k, value);
                }
                this.updateUi(false, false, true);

            } else {
                for (var k in data) {
                    var value = data[k];
                    this.updateControl(k, value, display, false, false);
                }
            }
        },

        /**
         *
         * @param data
         * @param display
         * @param forward (notused)
         * @param force
         */
        updateDisplays: function (data, display, forward, force) {

            if (force) {
                for (var k in data) {
                    var value = data[k];
                    statics.DisplaySettings.update(k, value);
                }
                this.updateUi(false, false, true);

            } else {
                for (var k in data) {
                    var value = data[k];
                    this.updateDisplay(k, value, display, false, false);
                }
            }
        },

        /**
         *
         * @param data
         * @param display
         * @param forward (notused)
         * @param force
         */
        updateSources: function (data, display, forward, force) {

            if (force) {
                for (var k in data) {
                    var value = data[k];
                    statics.SourceSettings.update(k, value);
                }
                this.updateUi(false, false, true);

            } else {
                for (var k in data) {
                    var value = data[k];
                    this.updateSource(k, value, display, forward, false);
                }
            }
        },

        /**
         *
         * @param layer
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         */
        updateSetting: function (layer, item, value, display, forward, force) {

            if (typeof value != 'object') {
                _log(item, value);
            }

            if (statics.AnimationSettings.contains(item)) {

                value = sm.update(layer, item, value);

                if (item in this.synced && this.synced[item]) {
                    this.shareSetting(item, value);
                }

                if (forward) {
                    var data = {};
                    data[item] = value;
                    messaging.emitSettings(layer, data, display, false, force)
                }

                if (display !== false) {
                    this.updateUi(item, false, false);
                    explorer.setChanged(statics.ControlSettings.layer, true);
                }
            }
        },

        /**
         *
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         */
        updateControl: function (item, value, display, forward, force) {

            if (typeof value != 'object') {
                _log(item, value);
            }

            if (statics.ControlSettings && statics.ControlSettings.contains(item)) {

                if (item == 'beat') {
                    value = beatkeeper.trigger(value, true, statics.ControlSettings.tempo, false);
                }

                value = statics.ControlSettings.update(item, value);

                if (item == 'layer') {
                    var l = sm.get(value);

                    this.updateSettings(value, l.settings, true, false, true);

                    explorer.resetLoaded();
                    explorer.setLoaded(value, true);

                    var config = {
                        action: 'attr',
                        query: '#layer',
                        key: 'data-mnemonic',
                        value: value + 1
                    };

                    messaging.onAttr(config);

                } else if (item == 'reset') {
                    if (force) {
                        sm.reset(splitToShuffleable(statics.ControlSettings.shuffleable));
                    }
                }

                if (forward) {
                    var data = {};
                    data[item] = value;
                    messaging.emitControls(data, true, false, force);
                }

                if (display !== false) {

                    if (item.match(/_(sequence|sample|source)/)) {
                        this.updateData();
                    }

                    this.updateUi(item, false, false);
                }

                if (item == 'session' && value != _HASH) {
                    document.location.hash = value;
                    document.location.reload();

                }
            }
        },

        /**
         *
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         */
        updateDisplay: function (item, value, display, forward, force) {

            if (typeof value != 'object') {
                _log(item, value);
            }

            if (statics.DisplaySettings.contains(item)) {

                value = statics.DisplaySettings.update(item, value);

                if (item.match(/display\d+_visible/)) {
                    var show = true;
                }

                if (forward) {
                    var data = {};
                    data[item] = value;
                    messaging.emitDisplays(data, true, false, force);
                }

                if (display !== false) {
                    this.updateUi(item, false, show);
                }

            }
        },

        /**
         *
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         */
        updateSource: function (item, value, display, forward, force) {

            if (typeof value != 'object') {
                _log(item, value);
            }

            if (statics.SourceSettings.contains(item)) {

                value = statics.SourceSettings.update(item, value);

                if (forward) {
                    var data = {};
                    data[item] = value;
                    messaging.emitSources(data, true, false, force);
                }

                if (display !== false) {

                    if (item.match(/_(start|end|input|sequence|source)/)) {
                        this.updateData();

                    } else if (item.match(/_(enabled)/)) {
                        if (!value) { // set record to false if enabled == false
                            var smp = number_extract(item, 'sample');
                            this.updateSource(getSampleRecordKey(smp), false, true, true, false);
                        }

                    } else if (item.match(/_(load)/)) {
                        this.loadClip(number_extract(item, 'sample'));
                    }

                    this.updateUi(item, false, false);
                }

            }
        },

        /**
         *
         * @param data
         */
        updateData: function (data) {

            if (data && data.data) {

                for (var key in data.data) {
                    if (key in statics) {
                        var sec = data.data[key];
                        for (var tkey in sec) {
                            var type = sec[tkey];
                            statics[key][tkey] = type;
                        }
                    }
                }
                controller.updateUi();
            }

            var inst = this;
            if (statics.SourceValues && statics.SourceValues.sequence) {
                for (var seq = 0; seq < statics.SourceValues.sequence.length; seq++) {

                    var _trigger = function (_seq) {

                        if (statics.timeouts.thumbs[_seq]) {
                            clearTimeout(statics.timeouts.thumbs[_seq]);
                        }

                        statics.timeouts.thumbs[_seq] = setTimeout(function () {
                            requestAnimationFrame(function () {
                                inst.updateClip(_seq);
                            });

                        }, 125);

                        requestAnimationFrame(function () {
                            inst.updateIndicator(_seq);
                        });

                    };

                    _trigger(seq);
                }
            }

            if (statics.timeouts.thumbs.samples) {
                clearTimeout(statics.timeouts.thumbs.samples);
            }

            statics.timeouts.thumbs.samples = setTimeout(function () {
                requestAnimationFrame(function () {
                    inst.updateThumbs();
                });

            }, 125);

        },

        /**
         *
         * @param item
         * @param value
         */
        setAllDisplaysTo: function (item, value, group) {
            var increment = value === false;
            if (increment) {
                value = 0;
            }
            group = splitToIntArray(statics.SourceSettings[group]);

            var updates = {};
            for (var i = 0; i < statics.DisplayValues.display.length; i++) {

                if (group.length && group.indexOf(i) < 0) {
                    continue;
                }

                var n = 'display' + i;
                var nv  = n + '_visible';
                if (statics.DisplaySettings[nv]) {
                    var key = new RegExp('^' + n + '_' + item);
                    var ns = n + '_static';
                    if (!statics.DisplaySettings[ns]) {
                        for (var c in statics.SourceSettings.initial) {
                            if (c.match(key)) {
                                updates[c] = value;

                                if (increment) {
                                    value++;
                                    if (value >= statics.SourceValues[item].length) {
                                        value = 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.updateSources(updates, true, false, false);
            messaging.emitSources(updates, true, true, false);
        },

        /**
         *
         * @param item
         * @param value
         */
        setAllSequencesTo: function (item, value) {
            var increment = value === false;
            if (increment) {
                value = 0;
            }
            var updates = {};
            for (var i = 0; i < statics.SourceValues.sequence.length; i++) {
                var n = 'sequence' + i;
                var key = new RegExp('^' + n + '_' + item);
                for (var c in statics.SourceSettings.initial) {
                    if (c.match(key)) {
                        updates[c] = value;

                        if (increment) {
                            value++;
                            if (value >= statics.SourceValues[item].length) {
                                value = 0;
                            }
                        }
                    }
                }
            }
            this.updateSources(updates, true, false, false);
            messaging.emitSources(updates, true, true, false);
        },

        /**
         *
         * @param item
         * @param value
         */
        setAllSamplesTo: function (item, value) {
            var increment = value === false;
            if (increment) {
                value = 0;
            }
            var updates = {};
            for (var i = 0; i < statics.SourceValues.sequence.length; i++) {
                var n = 'sample' + i;
                var key = new RegExp('^' + n + '_' + item);
                for (var c in statics.SourceSettings.initial) {
                    if (c.match(key)) {
                        updates[c] = value;

                        if (increment) {
                            value++;
                            if (value >= statics.SourceValues[item].length) {
                                value = 0;
                            }
                        }
                    }
                }
            }
            this.updateSources(updates, true, false, false);
            messaging.emitSources(updates, true, true, false);
        },

        /**
         *
         */
        syncLayers: function () {
            var inst = this;
            for (var layer in layers) {
                var to = parseInt(layer)*150;

                var st = function (layer, to) {
                    setTimeout(function () {
                        inst.syncLayer(layer);
                    }, to);
                };
                st(layer, to);
            }
            var to = statics.ControlValues.layer.length * 151;

            setTimeout(function () {
                inst.updateControl('layer', statics.ControlSettings.layer, true, true, true);
            }, to);
        },

        /**
         *
         */
        pushSources: function () {
            messaging.emitSources(statics.SourceSettings, true, true, false);
        },

        /**
         *
         * @param layer
         */
        syncLayer: function (layer) {
            var settings = layers[layer].settings;

            if (settings) {
                settings = settings.prepare();
                messaging.emitSettings(layer, settings, true, false, true);
            }
        },

        /**
         *
         * @param name
         * @param data
         */
        preset: function (name, data, layer) {

            _log('preset', name);

            var dflt = statics.AnimationSettings.defaults();
            dflt.clean(data, dflt);
            dflt.update(false, data);

            if (layer == undefined) {
                layer = statics.ControlSettings.layer;
            }

            this.updateSettings(layer, dflt, true, true, true);
            messaging.emitSettings(layer, statics.AnimationSettings.prepare(), false, false, true);
        },

        /**
         *
         * @param name
         * @param data
         */
        shaders: function (name, data, reset) {

            _log('shaders', name);

            var shaders = data.shaders;
            var nu = {};
            for (var n in shaders) {
                var shd = shaders[n];
                if (shd) {
                    if (reset) {
                        nu[n] = shd;

                    } else if (shd.apply) {
                        shd.index += 100;
                        nu[n] = shd;
                    }
                }
            }

            shaders = nu;

            for (var i = 0; i < layers.length; i++) {
                if ((i in layers)
                    && layers[i].settings
                    && layers[i].settings.shaders
                    && !layers[i].settings.isDefault()
                    && layerShuffleable(i) == layerShuffleable(statics.ControlSettings.layer)
                ) {
                    var settings = {shaders: shaders};
                    this.updateSettings(i, settings, true, true, true);

                    if (layers[i]._preset) {
                        explorer.setChanged(i, true);
                    }

                    messaging.emitSettings(i, settings, false, false, true);
                }
            }
        },

        /**
         *
         */
        refreshLayerInfo: function () {
            var preset = [];

            for (var i = 0; i < layers.length; i++) {
                if (layers[i]) {
                    var l = layers[i];

                    if (l.settings) {
                        var s = l.settings;

                        if (!s.isDefault() && layerShuffleable(i)) {
                            preset.push(i+1);
                        }
                    }
                }
            }

            var config = {
                action: 'attr',
                query: '#layers',
                key: 'data-label',
                value: preset.join('|')
            };

            messaging.onAttr(config);
        },

        /**
         *
         * @param item
         * @param control
         * @param show
         */
        updateUi: function (item, control, show) {

            if (!control) {
                control = this.gui;
                this.refreshLayerInfo();
            }

            var flds = control.__folders || [];

            for (var key in flds) {
                var fld = flds[key];

                this.updateUi(item, fld, false);
            }

            var ctrls = control.__controllers || [];

            for (var key in ctrls) {
                var ctrl = ctrls[key];
                if (!item || ctrl.__li.getAttribute('data-id') == item) {
                    ctrl.updateDisplay();
                }
            }

            if (show) {
                for (var i = 0; i < statics.DisplayValues.display.length; i++) {
                    var n = 'display' + i;
                    var v = statics.DisplaySettings[n + '_visible'];
                    this.showControls(n, 'g_sources', v);

                    n = '_display' + i;
                    this.showControls(n, 'g_displays', v);
                }
            }

        },

        /**
         *
         * @param open
         */
        resetFolder: function (open) {
            var rst = {};
            var controls = false;
            for (var i = 0; i < open.__controllers.length; i++) {
                var ctl = open.__controllers[i];
                if ('play' in ctl.object) {
                    controls = true;
                    if (statics.ControlSettings.contains(ctl.property)) {
                        var val = statics.ControlSettings.initial[ctl.property];
                        rst[ctl.property] = val;
                    }
                } else {
                    if (statics.AnimationSettings.contains(ctl.property)) {
                        var val = statics.AnimationSettings.initial[ctl.property];
                        rst[ctl.property] = val;
                    }
                }
            }

            if (controls) {
                controller.updateControls(rst, true, false);
                messaging.emitControls(rst, true, false, false);
            } else {
                controller.updateSettings(statics.ControlSettings.layer, rst, true, false);
                messaging.emitSettings(statics.ControlSettings.layer, rst, true, false, false);
            }
        }
    }
})();