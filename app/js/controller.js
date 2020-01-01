/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

let messaging = false;
let explorer = false;
let controller = false;
let midi = false;
let beatkeeper = false;
let layers = false;
let sm = false;
let cm = false;

/**
 *
 */
document.addEventListener('DOMContentLoaded', function () {

    onResize = function () {
        let columns = document.querySelectorAll('.left');
        let allover = document.body.clientHeight - 20;

        for (let i = 0; i < columns.length; i++) {
            let col = columns[i];

            // calcuclate heights of FH elements to figure out the rest
            let cells = col.querySelectorAll('.item.fh');
            let reserved = 0;
            let ii = 0;

            for (ii = 0; ii < cells.length; ii++) {
                reserved += cells[ii].clientHeight;
            }

            let spare = allover - reserved;

            cells = col.querySelectorAll('.item:not(.fh)');
            let cc = cells.length;

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

        HC.log(controller.name, 'connected', true, true);

        if (!reconnect) {

            loadResources(setupResources(), function () {

                sm = new HC.SettingsManager(statics.AnimationSettings, []);
                cm = new HC.ControlSetsManager([], statics.AnimationValues);

                statics.ControlController = new HC.ControlController();
                statics.DisplayController = new HC.DisplayController();
                statics.SourceController = new HC.SourceController();

                controller.init();
                controller.addControllers(statics.ControlController,
                    statics.ControlSettings,
                    statics.ControlValues,
                    statics.ControlTypes,
                    function (value) {
                        controller.updateControl(this.property, value, true, true, false);
                    }
                );
                controller.addControllers(statics.DisplayController,
                    statics.DisplaySettings,
                    statics.DisplayValues,
                    statics.DisplayTypes,
                    function (value) {
                        controller.updateDisplay(this.property, value, true, true, false);
                    }
                );
                controller.addControllers(statics.SourceController,
                    statics.SourceSettings,
                    statics.SourceValues,
                    statics.SourceTypes,
                    function (value) {
                        controller.updateSource(this.property, value, true, true, false);
                    }
                );
                controller.addAnimationControllers(cm.getGlobalProperties());

                controller.addShaderControllers();

                controller.addShaderPassControllers(HC.Controller.ShaderPassController.onPasses);

                explorer = new HC.Explorer();
                explorer.init();
                explorer.load();

                beatkeeper = new HC.Beatkeeper();

                messaging.sync(function (data) {
                    controller.loadSession(data);
                });

                controller.initKeyboard();
                controller.initLogEvents();
                midi = controller.initMidi(controller);

                onResize();
            });
        }
    });
});

{
    // todo var2let
    /**
     *
     * @type {HC.Controller}
     */
    HC.Controller = class Controller {
        gui = false;
        synced = {};
        thumbTimeouts = [];
        name;

        constructor(name) {
            this.name = name;
        }

        /**
         *
         */
        init() {
            // todo grid layout mit einer UI instanz pro controlset https://vuejsexamples.com/simple-and-flexible-vue-js-component-for-grid-layout/
            // todo UI wird in controlsetui initialisiert und platziert vom layoutmanager
            // todo neue UI https://github.com/colejd/guify
            // todo oder dat gui käse komplett mit aktueller datgui version aufbauen



            this.gui = new dat.GUI({autoPlace: false});
            document.getElementById('controller').appendChild(this.gui.domElement);
        }

        /**
         *
         * @param session
         */
        loadSession(session) {

            if ('controls' in session) {
                HC.log('controls', 'synced');
                let controls = session.controls;
                this.updateControls(controls, true, false, true);
            }
            if ('displays' in session) {
                HC.log('displays', 'synced');
                let displays = session.displays;
                this.updateDisplays(displays, true, false, true);
            }
            if ('sources' in session) {
                HC.log('sources', 'synced');
                let sources = session.sources;
                this.updateSources(sources, true, false, true);
            }
            if ('controlset' in session) {
                HC.log('controlset', 'synced');
                let settings = session.controlset;
                for (let k in settings) {
                    this.updateControlSets(k, settings[k], true, false, true);
                }
            }
            // if ('settings' in session) {
            //     HC.log('settings', 'synced');
            //     let settings = session.settings;
            //     for (let k in settings) {
            //         this.updateSettings(k, settings[k], true, false, true);
            //     }
            // }
            if ('data' in session) {
                HC.log('data', 'synced');
                this.updateData();
            }

            this.updateControl('layer', statics.ControlSettings.layer, true, false, false);
        }

        /**
         *
         * @param layer
         * @param data
         */
        migrateSettings0(layer, data) {

            let mappings = HC.ControlSetsManager.mappings(HC.ControlSetsManager.initAll(statics.AnimationValues));

            for (let k in data) {
                let value = data[k];
                if (typeof value !== 'object') {
                    let set = mappings[k];
                    if (set) {
                        cm.update(layer, set, k, value);
                    }

                } else if (k == 'shaders') {
                    // sort shaders by index
                    delete value._template;
                    let keys = Object.keys(value);
                    keys.sort(function (a, b) {
                        let ia = value[a].index;
                        let ib = value[b].index;

                        return ia - ib;
                    });

                    let passes = cm.get(layer, 'passes');
                    passes.removeShaderPasses();
                    for (let key in keys) {
                        let name = keys[key];
                        let sh = value[name];
                        if (sh.apply) {
                            let pass = {};
                            pass[name] = sh;
                            passes.addShaderPass(pass);
                        }
                    }

                    // todo migrate shaders and passes to CS
                }
            }
            this.updateUi();
        }

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateSettings(layer, data, display, forward, force) {

            if (force) {
                for (let k in data) {
                    let value = data[k];
                    sm.update(layer, k, value);
                }
                this.updateUi();

            } else {
                for (let k in data) {
                    let value = data[k];
                    this.updateSetting(layer, k, value, display, false, false);
                }
            }

            if (forward) {
                /**
                 * we don't want forwarding here because:
                 * - it could be enabled when coming from messaging.onSettings
                 * - there are several calls of updateSetting(....forward=true and then messaging.emitSettings that disallow
                 * calling messaging.emitSettings here
                 *
                 */
            }
        }

        /**
         *
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateControlSets(layer, data, display, forward, force) {

            if (force) {
                cm.updateData(layer, data);
                this.updateUi();

            } else {
                for (let k in data) {
                    let value = {};
                    value[k] = data[k];
                    this.updateControlSet(layer, value, display, false, false);
                }
            }

            if (forward) {
                /**
                 * we don't want forwarding here because:
                 * - it could be enabled when coming from messaging.onSettings
                 * - there are several calls of updateSetting(....forward=true and then messaging.emitSettings that disallow
                 * calling messaging.emitSettings here
                 *
                 */
            }
        }

        /**
         * todo CS
         * @param folder
         * @param datasource
         */
        shareSettings(folder, datasource) {

            let settings = {};
            if (!datasource) {
                let keys = Object.keys(statics.AnimationController[folder]);

                for (let i = 0; i < keys.length; i++) {
                    settings[keys[i]] = statics.AnimationSettings[keys[i]];
                }

            } else {
                settings[folder] = statics.AnimationSettings[folder];
            }

            for (let i = 0; i < layers.length; i++) {
                if (i != statics.ControlSettings.layer
                    && (i in layers)
                    && layers[i].settings
                    && !layers[i].settings.isDefault()
                    && layerShuffleable(i) == layerShuffleable(statics.ControlSettings.layer)
                ) {
                    this.updateSettings(i, settings, true, false, true);

                    if (layers[i]._preset) {
                        explorer.setChanged(i, true);
                    }

                    messaging.emitSettings(i, settings, false, false, true);
                }
            }
        }

        /**
         * todo CS
         * @param item
         * @param value
         */
        shareSetting(item, value) {
            let data = {};
            data[item] = value;

            for (let i = 0; i < layers.length; i++) {
                if (i != statics.ControlSettings.layer
                    && (i in layers)
                    && layers[i].settings
                    && !layers[i].settings.isDefault()
                    && layerShuffleable(i) == layerShuffleable(statics.ControlSettings.layer)
                ) {

                    this.updateSettings(i, data, true, false, true);

                    if (layers[i]._preset) {
                        explorer.setChanged(i, true);
                    }

                    messaging.emitSettings(i, data, false, false, true);
                }
            }
        }

        /**
         * todo CS
         * @param dir
         * @param value
         */
        setSynchronized(dir, value) {

            for (let key in statics.AnimationController[dir]) { // todo CS
                this.synced[key] = value;
            }

        }

        /**
         *
         * @param data
         * @param display
         * @param forward (notused)
         * @param force
         */
        updateControls(data, display, forward, force) {

            if (force) {
                for (let k in data) {
                    let value = data[k];
                    statics.ControlSettings.update(k, value);
                }
                this.updateUi();
                this.showDisplayControls();

            } else {
                for (let k in data) {
                    let value = data[k];
                    this.updateControl(k, value, display, false, false);
                }
            }
        }

        /**
         *
         * @param data
         * @param display
         * @param forward (notused)
         * @param force
         */
        updateDisplays(data, display, forward, force) {

            if (force) {
                for (let k in data) {
                    let value = data[k];
                    statics.DisplaySettings.update(k, value);
                }
                this.updateUi();
                this.showDisplayControls();

            } else {
                for (let k in data) {
                    let value = data[k];
                    this.updateDisplay(k, value, display, false, false);
                }
            }
        }

        /**
         *
         * @param data
         * @param display
         * @param forward (notused)
         * @param force
         */
        updateSources(data, display, forward, force) {

            if (force) {
                for (let k in data) {
                    let value = data[k];
                    statics.SourceSettings.update(k, value);
                }
                this.updateUi();
                this.showDisplayControls();

            } else {
                for (let k in data) {
                    let value = data[k];
                    this.updateSource(k, value, display, forward, false);
                }
            }
        }

        /**
         * todo delete CS
         *
         * @param layer
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         *
         */
        updateSetting(layer, item, value, display, forward, force) {

            if (typeof value != 'object') {
                HC.log(item, value);
                this.explainPlugin(item, value);
            }

            if (statics.AnimationSettings.contains(item)) {

                value = sm.update(layer, item, value);

                if (item in this.synced && this.synced[item]) {
                    this.shareSetting(item, value);
                }

                if (forward) {
                    let data = {};
                    data[item] = value;
                    messaging.emitSettings(layer, data, display, false, false);
                }

                if (display !== false) {
                    this.updateUi(item);
                    explorer.setChanged(statics.ControlSettings.layer, true);
                }
            }
        }

        /**
         *
         * @param layer
         * @param data
         * @param display
         * @param forward
         * @param force
         */
        updateControlSet(layer, data, display, forward, force) {

            let updated = cm.updateData(layer, data);
            let property;
            let value;
            if (isArray(updated)) {
                property = updated[0].property;
                value = updated[0].value;
            }

            if (property in this.synced && this.synced[property]) {
                this.shareSetting(property, value);
            }

            if (forward) {
                messaging.emitControlSet(layer, data, display, false, false);
            }

            if (display !== false) {
                this.updateUi(property);
                explorer.setChanged(statics.ControlSettings.layer, true);
            }
        }

        /**
         *
         * @param layer
         * @param ctrl
         */
        addShaderPass(layer, ctrl) {
            let passes = cm.get(layer, 'passes');
            let pass = {};
            pass[ctrl.name] = ctrl.getShader();
            passes.addShaderPass(pass);

            this.addShaderPassController(ctrl, this._passes);
        }

        /**
         *
         * @param passes
         */
        loadShaderPassControllers(passes) {
            for (let key in passes) {
                let sh = passes[key];
                // let ctrl = new HC.Controller.ShaderPassController(sh.name);
                // this.addShaderPassController(ctrl, this._passes);
            }
        }

        /**
         *
         */
        cleanShaderPasses() {

            let passes = cm.get(statics.ControlSettings.layer, 'passes').getShaderPasses();

            for (let key in passes) {
                let sh = passes[key];
                if (!sh || sh.apply === false) {
                    delete settings.passes[key];
                }
            }
        }

        /**
         *
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         */
        updateControl(item, value, display, forward, force) {

            if (typeof value != 'object') {
                HC.log(item, value);
                this.explainPlugin(item, value, HC);
            }

            if (statics.ControlSettings && statics.ControlSettings.contains(item)) {

                if (item == 'beat') {
                    value = beatkeeper.trigger(value, true, statics.ControlSettings.tempo, false);
                }

                value = statics.ControlSettings.update(item, value);

                if (item == 'layer') {

                    // this.updateSettings(value, l.settings.prepare(), true, false, true);
                    this.updateControlSets(value, cm.prepareLayer(value), true, false, true);

                    explorer.resetLoaded();
                    explorer.setLoaded(value, true);

                    let config = {
                        action: 'attr',
                        query: '#layer',
                        key: 'data-mnemonic',
                        value: value + 1
                    };

                    messaging.onAttr(config);

                } else if (item == 'reset') {
                    if (force) {
                        cm.reset(splitToShuffleable(statics.ControlSettings.shuffleable));
                        // sm.reset(splitToShuffleable(statics.ControlSettings.shuffleable));
                    }
                }

                if (forward) {
                    let data = {};
                    data[item] = value;
                    messaging.emitControls(data, true, false, force);
                }

                if (display !== false) {

                    if (item.match(/_(sequence|sample|source)/)) {
                        this.updateData();
                    }

                    this.updateUi(item);
                }

                if (item == 'session' && value != _HASH) {
                    document.location.hash = value;
                    document.location.reload();

                }
            }
        }

        /**
         *
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         */
        updateDisplay(item, value, display, forward, force) {

            if (typeof value != 'object') {
                HC.log(item, value);
                // this.explainPlugin(item, value);
            }

            if (statics.DisplaySettings.contains(item)) {

                value = statics.DisplaySettings.update(item, value);

                if (item.match(/display\d+_visible/)) {
                    this.showDisplayControls();
                }

                if (forward) {
                    let data = {};
                    data[item] = value;
                    messaging.emitDisplays(data, true, false, force);
                }

                if (display !== false) {
                    this.updateUi(item);
                }

            }
        }

        /**
         *
         * @param item
         * @param value
         * @param display
         * @param forward
         * @param force
         */
        updateSource(item, value, display, forward, force) {

            if (typeof value != 'object') {
                HC.log(item, value);
                // this.explainPlugin(item, value);
            }

            if (statics.SourceSettings.contains(item)) {

                value = statics.SourceSettings.update(item, value);

                if (forward) {
                    let data = {};
                    data[item] = value;
                    messaging.emitSources(data, true, false, force);
                }

                if (display !== false) {

                    if (item.match(/_(start|end|input|sequence|source)/)) {
                        this.updateData();

                    } else if (item.match(/_(enabled)/)) {
                        if (!value) { // set record to false if enabled == false
                            let smp = numberExtract(item, 'sample');
                            this.updateSource(getSampleRecordKey(smp), false, true, true, false);
                        }

                    } else if (item.match(/_(load)/)) {
                        this.loadClip(numberExtract(item, 'sample'));
                    }

                    this.updateUi(item);
                }

            }
        }

        /**
         *
         * @param data
         */
        updateData(data) {

            if (data && data.data) {

                for (let key in data.data) {
                    if (key in statics) {
                        let sec = data.data[key];
                        for (let tkey in sec) {
                            let type = sec[tkey];
                            statics[key][tkey] = type;
                        }
                    }
                }
                controller.updateUi();
            }

            if (statics.SourceValues && statics.SourceValues.sequence) {
                for (let seq = 0; seq < statics.SourceValues.sequence.length; seq++) {

                    let _trigger = (_seq) => {

                        clearTimeout(this.thumbTimeouts[_seq]);

                        this.thumbTimeouts[_seq] = setTimeout(() => {
                            requestAnimationFrame(() => {
                                this.updateClip(_seq);
                            });

                        }, 125);

                        requestAnimationFrame(() => {
                            this.updateIndicator(_seq);
                        });

                    };

                    _trigger(seq);
                }
            }

            clearTimeout(this.thumbTimeouts.samples);

            this.thumbTimeouts.samples = setTimeout(() => {
                requestAnimationFrame(() => {
                    this.updateThumbs();
                });

            }, 125);
        }

        /**
         *
         * @param data
         */
        updateMidi(data) {
            if (midi) {
                if (data.command == 'glow') {
                    midi.glow(data.data, data.conf);

                } else if (data.command == 'off') {
                    midi.off(data.data);

                } else if (data.command == 'clock') {
                    midi.clock(data.data, data.conf);
                }
            }
        }

        /**
         *
         * @param item
         * @param value
         */
        setAllDisplaysTo(item, value, group) {
            let increment = value === false;
            if (increment) {
                value = 0;
            }
            group = splitToIntArray(statics.SourceSettings[group]);

            let updates = {};
            for (let i = 0; i < statics.DisplayValues.display.length; i++) {

                if (group.length && group.indexOf(i) < 0) {
                    continue;
                }

                let n = 'display' + i;
                let nv = n + '_visible';
                if (statics.DisplaySettings[nv]) {
                    let key = new RegExp('^' + n + '_' + item);
                    let ns = n + '_static';
                    if (!statics.DisplaySettings[ns]) {
                        for (let c in statics.SourceSettings.initial) {
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
        }

        /**
         *
         * @param item
         * @param value
         */
        setAllSequencesTo(item, value) {
            let increment = value === false;
            if (increment) {
                value = 0;
            }
            let updates = {};
            for (let i = 0; i < statics.SourceValues.sequence.length; i++) {
                let n = 'sequence' + i;
                let key = new RegExp('^' + n + '_' + item);
                for (let c in statics.SourceSettings.initial) {
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
        }

        /**
         *
         * @param item
         * @param value
         */
        setAllSamplesTo(item, value) {
            let increment = value === false;
            if (increment) {
                value = 0;
            }
            let updates = {};
            for (let i = 0; i < statics.SourceValues.sequence.length; i++) {
                let n = 'sample' + i;
                let key = new RegExp('^' + n + '_' + item);
                for (let c in statics.SourceSettings.initial) {
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
        }

        /**
         *
         */
        syncLayers() {
            for (let layer in layers) {
                let to = parseInt(layer) * 150;

                let st = (layer, to) => {
                    setTimeout(() => {
                        this.syncLayer(layer);
                    }, to);
                };
                st(layer, to);
            }
            let to = statics.ControlValues.layer.length * 151;

            setTimeout(() => {
                this.updateControl('layer', statics.ControlSettings.layer, true, true, true);
            }, to);
        }

        /**
         *
         */
        pushSources() {
            messaging.emitSources(statics.SourceSettings, true, true, false);
        }

        /**
         *
         * @param layer
         */
        syncLayer(layer) {
            let settings = cm.prepareLayer(layer);

            if (settings) {
                messaging.emitControlSet(layer, settings, true, false, true);
            }
        }

        /**
         *
         * @param name
         * @param data
         */
        updatePreset(name, data, layer) {

            HC.log('preset', name);

            if (layer == undefined) {
                layer = statics.ControlSettings.layer;
            }

            if (!('info' in data)) {
                // todo does it work?
                this.migrateSettings0(layer, data, true, false, true);

            // example!
            // } else if ('info' in data && data.info.version > 1.99) {
                // this.migrateSettings1(layer, data, true, false, true);

            } else {
                this.updateControlSets(layer, data, true, false, true);
            }

            messaging.emitControlSet(layer, cm.prepareLayer(layer), false, false, true);

            // this.updateSettings(layer, dflt.prepare(), true, false, true);
            // messaging.emitSettings(layer, statics.AnimationSettings.prepare(), false, false, true);
        }

        /**
         *
         * @param name
         * @param data
         */
        shaders(name, data, reset) {

            HC.log('shaders', name);

            let shaders = data.shaders;
            let nu = {};
            for (let n in shaders) {
                let shd = shaders[n];
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

            for (let i = 0; i < layers.length; i++) {
                if ((i in layers)
                    && layers[i].settings
                    && layers[i].settings.shaders
                    && !layers[i].settings.isDefault()
                    && layerShuffleable(i) == layerShuffleable(statics.ControlSettings.layer)
                ) {
                    let settings = {shaders: shaders};
                    this.updateSettings(i, settings, true, false, true);

                    if (layers[i]._preset) {
                        explorer.setChanged(i, true);
                    }

                    messaging.emitSettings(i, settings, false, false, true);
                }
            }
        }

        /**
         *
         */
        refreshLayerInfo() {
            let preset = [];

            for (let i = 0; i < layers.length; i++) {
                if (layers[i]) {
                    let l = layers[i];

                    if (l.settings) {
                        let s = l.settings;
                        // todo cm.isDefault(l)
                        if (!s.isDefault() && layerShuffleable(i)) {
                            preset.push(i + 1);
                        }
                    }
                }
            }

            let config = {
                action: 'attr',
                query: '#layers',
                key: 'data-label',
                value: preset.join('|')
            };

            messaging.onAttr(config);
        }

        /**
         *
         * @param open
         */
        resetFolder(open) {
            let rst = {};
            let controls = false;
            for (let i = 0; i < open.__controllers.length; i++) {
                let ctl = open.__controllers[i];

                if ('play' in ctl.object) {
                    controls = true;
                    if (statics.ControlSettings.contains(ctl.property)) {
                        let val = statics.ControlSettings.initial[ctl.property];
                        rst[ctl.property] = val;
                    }

                } else {
                    if (statics.AnimationSettings.contains(ctl.property)) {
                        let val = statics.AnimationSettings.initial[ctl.property];
                        rst[ctl.property] = val;
                    }
                }
            }

            if (controls) {
                controller.updateControls(rst, true, false);
                messaging.emitControls(rst, true, false, false);

            } else {
                // todo CS
                controller.updateSettings(statics.ControlSettings.layer, rst, true, false, false);
                messaging.emitSettings(statics.ControlSettings.layer, rst, true, false, false);
            }
        }
    }
}