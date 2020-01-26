/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

/**
 *
 * @type {HC.Messaging}
 */
let messaging;

/**
 *
 * @type {HC.Controller}
 */
let controller;

/**
 *
 * @type {HC.LayeredControlSetsManager}
 */
let cm;

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

    messaging.connect(function (reconnect, controller) {

        setTimeout(() => {
            document.getElementById(_MONITOR).setAttribute('src', 'monitor.html#' + messaging.sid);
        }, 250);

        HC.log(controller.name, 'connected', true, true);

        if (!reconnect) {

            loadResources(setupResources(), function () {

                cm = new HC.LayeredControlSetsManager([], statics.AnimationValues);
                statics.DataSettings = new HC.Settings({});

                controller.init();
                controller.loadSession();
                controller.initKeyboard();
                controller.initLogEvents();
                controller.midi = new HC.Midi(controller, statics);
                controller.midi.init();

                onResize();
            });
        }
    });
});

{
    /**
     *
     * @type {HC.Controller}
     */
    HC.Controller = class Controller {

        /**
         * @type {HC.Guify[]}
         */
        guis;

        /**
         * @type {HC.SourceControllerClip[]}
         */
        clips;

        /**
         * @type {HC.SourceControllerThumb[]}
         */
        thumbs;

        /**
         * @type {HC.Guify}
         */
        controlSettingsGui;
        /**
         * @type {HC.Guify}
         */
        displaySettingsGui;
        /**
         * @type {HC.Guify}
         */
        sourceSettingsGui;
        /**
         * @type {HC.Guify}
         */
        animationSettingsGui;

        /**
         * @type {HC.Guify}
         */
        configurationSettingsGui;

        /**
         *
         * @type {{}}
         */
        synced = {};

        /**
         *
         * @type {*[]}
         */
        thumbTimeouts = [];

        /**
         * @type {string}
         */
        name;

        /**
         *
         * @type {boolean}
         */
        ready = false;

        /**
         *
         * @type {HC.Midi}
         */
        midi;

        /**
         * @type {HC.Messaging}
         */
        messaging;

        /**
         * @type {HC.BeatKeeper}
         */
        beatKeeper;

        /**
         *
         * @param name
         */
        constructor(name) {
            this.name = name;
        }

        /**
         *
         */
        init() {
            this.controlSettingsGui = new HC.Guify('ControlSettings', true);
            this.displaySettingsGui = new HC.Guify('DisplaySettings');
            this.sourceSettingsGui = new HC.Guify('SourceSettings');
            this.animationSettingsGui = new HC.Guify('AnimationSettings');
            this.configurationSettingsGui = new HC.Guify('ConfigurationSettings');

            this.guis = [
                this.controlSettingsGui,
                this.displaySettingsGui,
                this.sourceSettingsGui,
                this.animationSettingsGui,
            ];
            this.beatKeeper = new HC.BeatKeeper();
            this.explorer = new HC.Explorer(this, statics); // todo lets have utilities classes have owners instead calling eg. controller directly

            let controlSets = HC.Statics.initControlControlSets();
            statics.ControlSettingsManager = new HC.ControlSetsManager(controlSets);
            statics.ControlSettings = statics.ControlSettingsManager.settingsProxy();
            statics.ControlTypes = statics.ControlSettingsManager.typesProxy();
            statics.ControlValues = statics.ControlSettingsManager.valuesProxy(statics.ControlValues);

            this.addGuifyControllers(
                controlSets,
                HC.ControlControllerUi,
                this.controlSettingsGui
            );

            let displaySets = HC.Statics.initDisplayControlSets();
            statics.DisplaySettingsManager = new HC.ControlSetsManager(displaySets);
            statics.DisplaySettings = statics.DisplaySettingsManager.settingsProxy();
            statics.DisplayTypes = statics.DisplaySettingsManager.typesProxy();
            statics.DisplayValues = statics.DisplaySettingsManager.valuesProxy(statics.DisplayValues);

            this.addGuifyDisplayControllers(
                HC.DisplayController,
                displaySets,
                HC.DisplayControllerUi,
                this.displaySettingsGui
            );

            let sourceSets = HC.Statics.initSourceControlSets();
            statics.SourceSettingsManager = new HC.ControlSetsManager(sourceSets);
            statics.SourceSettings = statics.SourceSettingsManager.settingsProxy();
            statics.SourceTypes = statics.SourceSettingsManager.typesProxy();
            statics.SourceValues = statics.SourceSettingsManager.valuesProxy(statics.SourceValues);

            this.addGuifyControllers(
                sourceSets,
                HC.SourceControllerUi,
                this.sourceSettingsGui
            );

            this.addConfigurationSettings();
            this.initStatusBar();
            this.initClips();
            this.initThumbs();

            this.addAnimationControllers(cm.getGlobalProperties());
            this.addPassesFolder(HC.ShaderPassUi.onPasses);
        }

        /**
         *
         * @param {HC.Messaging} messaging
         */
        setMessaging(messaging) {
            this.messaging = messaging;
        }

        /**
         *
         */
        loadSession() {
            this.messaging.sync((session) => {
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
                if ('settings' in session) {
                    HC.log('settings', 'synced');
                    let settings = session.settings;
                    for (let k in settings) {
                        this.updateSettings(k, settings[k], true, false, true);
                    }
                }
                if ('data' in session) {
                    HC.log('data', 'synced');
                    this.updateData();
                }

                this.updateControl('layer', statics.ControlSettings.layer, true, false, false);
            });
        }

        /**
         *
         * @param layer
         * @param data
         */
        migrateSettings0(layer, data, keepPasses) {

            let mappings = HC.LayeredControlSetsManager.mappings(() => {return HC.LayeredControlSetsManager.initAll(statics.AnimationValues);});

            let passes = cm.get(layer, 'passes');
            if (keepPasses !== true) {
                passes.removeShaderPasses();
            }

            for (let k in data) {
                let value = data[k];
                if (k == 'shaders' || k == 'passes') {
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
                            let pass = {};
                            pass[name] = sh;
                            passes.addShaderPass(pass);
                        }
                    }
                } else {
                    let set = mappings[k];
                    if (set) {
                        cm.update(layer, set, k, value);
                    }
                }

            }
            this.updateUi(this.animationSettingsGui);
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
                cm.updateData(layer, data);
                this.updateUi(this.animationSettingsGui);

            } else {
                for (let k in data) {
                    let value = {};
                    value[k] = data[k];
                    this.updateSetting(layer, value, display, false, false);
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
         * @param folder
         * @param datasource
         */
        shareSettings(folder, datasource) {

            let settings = {};
            let controlSets = cm.prepareLayer(statics.ControlSettings.layer);
            if (!datasource) {
                let keys = Object.keys(controlSets[folder]);

                for (let i = 0; i < keys.length; i++) {
                    settings[keys[i]] = controlSets[folder][keys[i]];
                }

            } else {
                settings[folder] = controlSets[folder];
            }

            let data = {};
            data[folder] = settings;

            for (let i = 0; i < statics.ControlValues.layer.length; i++) {
                if (i == statics.ControlSettings.layer) {
                    continue;
                }
                if (cm.isDefault(i)) {
                    continue;
                }
                if (layerShuffleable(i) != layerShuffleable(statics.ControlSettings.layer)) {
                    continue;
                }

                this.updateSettings(i, data, true, false, true);

                if (cm.layers[i]._preset) {
                    this.explorer.setChanged(i+1, true);
                }

                this.messaging.emitSettings(i, data, false, false, true);

            }
        }

        /**
         *
         * @param item
         * @param value
         */
        shareSetting(item, value) {
            let mappings = HC.LayeredControlSetsManager.mappings(() => {return HC.LayeredControlSetsManager.initAll(statics.AnimationValues);});
            let set = mappings[item];
            let data = {};
            data[set] = {};
            data[set][item] = value;

            for (let i = 0; i < statics.ControlValues.layer.length; i++) {
                if (i == statics.ControlSettings.layer) {
                    console.log('currentlayer');
                    continue;
                }
                if (cm.isDefault(i)) {
                    console.log('isdefault');
                    continue;
                }
                if (layerShuffleable(i) != layerShuffleable(statics.ControlSettings.layer)) {
                    console.log('not same kind of shuffleable');
                    continue;
                }

                this.updateSettings(i, data, false, false, true);

                this.explorer.setChanged(i+1, true);
                this.messaging.emitSettings(i, data, false, false, true);
            }
        }

        /**
         *
         * @param dir
         * @param value
         */
        setSynchronized(dir, value) {

            let controlSets = cm.prepareLayer(0);
            for (let key in controlSets[dir]) {
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
                    statics.ControlSettingsManager.updateItem(k, value);
                }
                this.updateUi(this.controlSettingsGui);
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
                    value = statics.DisplaySettingsManager.updateItem(k, value);
                }
                this.updateUi(this.displaySettingsGui);
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
                    statics.SourceSettingsManager.updateItem(k, value);
                }
                this.updateUi(this.sourceSettingsGui);
                this.showDisplayControls();

            } else {
                for (let k in data) {
                    let value = data[k];
                    this.updateSource(k, value, display, forward, false);
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
        updateSetting(layer, data, display, forward, force) {

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
                this.messaging.emitSettings(layer, data, display, false, false);
            }

            if (display !== false) {
                this.explainPlugin(property, value);
                this.updateUi(this.animationSettingsGui);
                this.explorer.setChanged(statics.ControlSettings.layer+1, true);
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

            this.updateUi(this.animationSettingsGui);

            let data = {passes: {shaders: passes.getShaderPasses()}};
            this.messaging.emitSettings(layer, data, false, false, false);
        }

        /**
         *
         */
        cleanShaderPasses() {

            let cs = cm.get(statics.ControlSettings.layer, 'passes');
            let passes = cs.getShaderPasses();

            for (let key in passes) {
                let sh = cs.getShader(key);
                if (!sh || sh.apply === false) {
                    cs.removeShaderPass(key);
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

            // if (statics.ControlSettings) {

                if (item == 'beat') {
                    value = this.beatKeeper.trigger(value, true, statics.ControlSettings.tempo, false);
                }

            let tValue = value;
                value = statics.ControlSettingsManager.updateItem(item, value);

                if (item == 'layer') {
                    this.updateSettings(value, cm.prepareLayer(value), true, false, true);

                    controller.explorer.resetLoaded();
                    controller.explorer.setLoaded(value, true);

                    let config = {
                        action: 'attr',
                        query: '#layer',
                        key: 'data-mnemonic',
                        value: value + 1
                    };

                    this.messaging.onAttr(config);

                } else if (item == 'reset') {
                    if (force) {
                        cm.reset(splitToShuffleable(statics.ControlSettings.shuffleable));
                    }
                }

                if (forward) {
                    if (typeof value === 'function') { // reset to
                        value = tValue;
                    }
                    let data = {};
                    data[item] = value;
                    this.messaging.emitControls(data, true, false, force);
                }

                if (display !== false) {

                    if (item.match(/_(sequence|sample|source)/)) {
                        this.updateData();
                    }

                    this.updateUi(this.controlSettingsGui);
                }

                if (item == 'session' && value != _HASH) {
                    document.location.hash = value;
                    document.location.reload();

                }
            // }
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

            value = statics.DisplaySettingsManager.updateItem(item, value);

            if (item.match(/display\d+_visible/)) {
                this.showDisplayControls();
            }

            if (forward) {
                let data = {};
                data[item] = value;
                this.messaging.emitDisplays(data, true, false, force);
            }

            if (display !== false) {
                this.updateUi(this.displaySettingsGui);
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

            value = statics.SourceSettingsManager.updateItem(item, value);

            if (display !== false) {

                if (item.match(/_(start|end|sequence|input|source)$/)) {
                    this.updateData();

                } else if (item.match(/_(enabled)/)) {
                    if (!value) { // set record to false if enabled == false
                        let smp = numberExtract(item, 'sample');
                        this.updateSource(getSampleRecordKey(smp), false, true, true, false);

                        let seq = false;
                        while ((seq = getSequenceBySample(smp)) !== false) {
                            let key = getSequenceSampleKey(seq);
                            this.updateSource(key, 'off', true, true, false);
                        }
                    }

                } else if (item.match(/_(load)/)) {
                    let smp = numberExtract(item, 'sample');
                    this.loadClip(smp);
                }

                this.updateUi(this.sourceSettingsGui);
            }

            if (forward) {
                let data = {};
                data[item] = value;
                this.messaging.emitSources(data, true, false, force);
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
                controller.updateUi(this.sourceSettingsGui);
            }

            if (statics.SourceValues && statics.SourceValues.sequence) {
                for (let seq = 0; seq < statics.SourceValues.sequence.length; seq++) {

                    // set sequence inputs without enabled sample to off
                    if (getSampleEnabledBySequence(seq) === false) {
                        let key = getSequenceSampleKey(seq);
                        setTimeout(() => {
                            this.updateSource(key, 'off', false, true);
                        }, 125);
                    }

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
            if (this.midi) {
                if (data.command == 'glow') {
                    this.midi.glow(data.data, data.conf);

                } else if (data.command == 'off') {
                    this.midi.off(data.data);

                } else if (data.command == 'clock') {
                    this.midi.clock(data.data, data.conf);
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
            group = splitToIntArray(statics.SourceSettings[group]);

            let updates = {};
            for (let i = 0; i < statics.DisplayValues.display.length; i++) {

                if (group.length && group.indexOf(i) < 0) {
                    continue;
                }

                let n = 'display' + i;
                let nv = n + '_visible';
                if (statics.DisplaySettings[nv]) {
                    let key = n + '_' + item;
                    let ns = n + '_static';
                    if (!statics.DisplaySettings[ns]) {
                        if (increment) {
                            value = statics.SourceSettings[n + '_' + item];
                            value++;
                            if (value >= statics.SourceValues[item].length) {
                                value = 0;
                            }
                        }

                        updates[key] = value;
                    }
                }
            }
            this.updateSources(updates, true, false, false);
            this.messaging.emitSources(updates, true, true, false);
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
            this.messaging.emitSources(updates, true, true, false);
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
            this.messaging.emitSources(updates, true, true, false);
        }

        /**
         * question push even if monitor is enabled? how do it nicely?
         */
        syncLayers() {
            for (let layer in cm.layers) {
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
            this.messaging.emitSources(statics.SourceSettings, true, true, false);
        }

        /**
         *
         * @param layer
         */
        syncLayer(layer) {
            let settings = cm.prepareLayer(layer);

            if (settings) {
                this.messaging.emitSettings(layer, settings, true, false, true);
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

            cm.resetLayer(layer);

            if (!('info' in data)) {
                this.migrateSettings0(layer, data);

            // example!
            // } else if ('info' in data && data.info.version > 1.99) {
                // this.migrateSettings1(layer, data, true, false, true);

            } else {
                this.updateSettings(layer, data, false, false, true);
            }

            data = cm.prepareLayer(layer);
            if (cm.get(layer, 'info').hasTutorial()) {
                new HC.ScriptProcessor(name, Object.create(data.info.tutorial)).log();

                data.info.tutorial = {}; // fixme tutorial will be deleted on savePreset
            }

            this.messaging.emitSettings(layer, data, false, false, true);
        }

        /**
         *
         * @param name
         * @param data
         */
        transferShaderPasses(name, data) {

            HC.log('passes', name);

            for (let i = 0; i < statics.ControlValues.layer.length; i++) {
                if (!cm.get(i, 'passes').isDefault()
                    && layerShuffleable(i) == layerShuffleable(statics.ControlSettings.layer)
                ) {
                    if (!('info' in data)) {

                        let shaders = {shaders: data.shaders};
// fixme migration does not work?
                        this.migrateSettings0(i, shaders, true);

                    // example!
                    // } else if ('info' in data && data.info.version > 1.99) {
                    // this.migrateSettings1(layer, data, true, false, true);

                    } else {
                        let nu = data.passes;
                        let passes = cm.get(i, 'passses');

                        for (let k in nu) {
                            passes.addShaderPass(nu[k]);
                        }
                    }

                    if (cm.layers[i]._preset) {
                        controller.explorer.setChanged(i+1, true);
                    }

                    this.messaging.emitSettings(i, cm.prepareLayer(i), false, false, true);
                }
            }
        }

        /**
         *
         */
        refreshLayerInfo() {
            let preset = [];

            for (let i = 0; i < statics.ControlValues.layer.length; i++) {
                if (cm.layers[i]) {
                    let l = cm.getLayer(i);
                    if (!cm.isDefault(l) && layerShuffleable(i)) {
                        preset.push(i + 1);
                    }
                }
            }

            let config = {
                action: 'attr',
                query: '#layers',
                key: 'data-label',
                value: preset.join('|')
            };

            this.messaging.onAttr(config);
        }

        /**
         *
         * @param open {HC.GuifyFolder}
         */
        resetFolder(open) {
            let set = open.getKey();
            if (set) {
                let cs = cm.get(statics.ControlSettings.layer, set);
                if (cs) {
                    cs.reset();
                    let data = cs.prepare();
                    controller.updateSetting(statics.ControlSettings.layer, data, true, true, false);
                }
            }
        }
    }
}
