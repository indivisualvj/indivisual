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
 */
document.addEventListener('DOMContentLoaded', function () {

     let controller = new HC.Controller(G_INSTANCE);
    messaging = new HC.Messaging(controller);
    let config = new HC.Config(messaging);

    messaging.connect(function (reconnect, controller) {

        setTimeout(() => {
            document.querySelector('iframe.monitor').setAttribute('src', 'monitor.html#' + messaging.sid);
        }, 1500);

        HC.log(controller.name, 'connected', true, true);

        if (!reconnect) {

            config.loadConfig(function (config) {
                let sets = config.initControlSets();
                controller.init(config, sets);

                onResize();
            });
        }
    });
});

{
    HC.Controller = class Controller extends HC.Program {

        /**
         * @type {HC.Guify[]}
         */
        guis;

        /**
         * @type {HC.SourceControllerSample[]}
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
         * @type {HC.Guify}
         */
        sequenceSettingsGui;

        /**
         * @type {HC.PresetManager}
         */
        presetMan;

        /**
         * @type {HC.Monitor}
         */
        monitor;

        /**
         *
         * @type {{}}
         */
        synced = {};

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
         *
         * @param {HC.Config}config
         * @param sets
         */
        init(config, sets) {
            this.config = config;

            this.settingsManager = new HC.LayeredControlSetsManager(config.AnimationValues);
            this.monitor = new HC.Monitor();
            this.monitor.activate(false);
            this.midi = new HC.Midi(this);

            this.controlSettingsGui = new HC.Guify('ControlSettings', 'control');
            this.displaySettingsGui = new HC.Guify('DisplaySettings', 'display');
            this.sourceSettingsGui = new HC.Guify('SourceSettings', 'source');
            this.animationSettingsGui = new HC.Guify('AnimationSettings', 'animation');
            this.sequenceSettingsGui = new HC.Guify('SequenceSettings', 'sequence');
            this.presetMan = new HC.PresetManager('Presets', 'presets', this);
            this.configurationSettingsGui = new HC.Guify('ConfigurationSettings', 'config');

            this.guis = [
                this.controlSettingsGui,
                this.displaySettingsGui,
                this.sourceSettingsGui,
                this.animationSettingsGui,
                this.sequenceSettingsGui,
                this.presetMan.gui,
            ];
            this.beatKeeper = new HC.BeatKeeper(null, this.config);
            this.sourceManager = new HC.SourceManager(null, { config: this.config, sample: [] });

            let controlSets = sets.controlSets;
            this.config.ControlSettings.session = _HASH; // ugly workaround

            this.addGuifyControllers(
                controlSets,
                HC.ControlControllerUi,
                this.controlSettingsGui
            );

            let displaySets = sets.displaySets;

            this.addGuifyDisplayControllers(
                HC.DisplayController,
                displaySets,
                HC.DisplayControllerUi,
                this.displaySettingsGui
            );

            let sourceSets = sets.sourceSets;
            sourceSets.sequenceN.visible = false;
            this.addGuifyControllers(
                sourceSets,
                HC.SourceControllerUi,
                this.sourceSettingsGui
            );

            sourceSets.sequenceN.visible = true;
            sourceSets.sample.visible = false;
            sourceSets.override.visible = false;
            sourceSets.source.visible = false;

            this.addGuifyControllers(
                sourceSets,
                HC.SequenceControllerUi,
                this.sequenceSettingsGui
            );

            this.initSamples();

            this.addAnimationControllers(this.settingsManager.getGlobalProperties());
            this.addPassesFolder(HC.ShaderPassUi.onPasses);

            this.openTreeByPath('controls');

            this.midi.init();
            this.loadSession();
            this.presetMan.reload();
            this.initEvents();
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
            let syncing = true;
            this.midi.loading(() => {
                return syncing;
            })
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
                    for (let layer in settings) {
                        this.updateSettings(layer, settings[layer], true, false, true);
                    }
                }
                if ('data' in session) {
                    HC.log('data', 'synced');
                    this.updateData();
                }

                syncing = false;
                this.updateControl('layer', this.config.ControlSettings.layer, true, false, false);

                this._checkDisplayVisibility();
            });
        }

        /**
         *
         * @param layer {number}
         * @param data {Object}
         * @param display {boolean}
         * @param forward {boolean}
         * @param force {boolean}
         */
        updateSettings(layer, data, display, forward, force) {

            if (force) {
                this.settingsManager.updateData(layer, data);
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
            let controlSets = this.settingsManager.prepareLayer(this.config.ControlSettings.layer);
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

            for (let i = 0; i < this.config.ControlValues.layers; i++) {
                if (i === this.config.ControlSettings.layer) {
                    continue;
                }
                if (this.settingsManager.isDefault(i)) {
                    continue;
                }

                // share only beetween layers of same type
                if (this.config.shuffleable(this.config.ControlSettings.layer+1) !== this.config.shuffleable(i+1)) {
                    continue;
                }

                this.updateSettings(i, data, true, false, true);

                this.presetMan.setChanged(i+1, true);

                this.messaging.emitSettings(i, data, false, false, true);

            }
        }

        /**
         *
         * @param item
         * @param value
         */
        shareSetting(item, value) {
            let mappings = HC.LayeredControlSetsManager.mappings(() => {return HC.LayeredControlSetsManager.initAll(this.config.AnimationValues);});
            let set = mappings[item];
            let data = {};
            data[set] = {};
            data[set][item] = value;

            for (let i = 0; i < this.config.ControlValues.layers; i++) {
                if (i === this.config.ControlSettings.layer) {
                    continue;
                }
                if (this.settingsManager.isDefault(i)) {
                    continue;
                }

                // share only beetween layers of same type
                if (this.config.shuffleable(this.config.ControlSettings.layer+1) !== this.config.shuffleable(i+1)) {
                    continue;
                }

                this.updateSettings(i, data, false, false, true);

                this.presetMan.setChanged(i+1, true);
                this.messaging.emitSettings(i, data, false, false, true);
            }
        }

        /**
         *
         * @param dir
         * @param value
         */
        setSynchronized(dir, value) {

            let controlSets = this.settingsManager.prepareLayer(0);
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
                    this.config.ControlSettingsManager.updateItem(k, value);
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
                    value = this.config.DisplaySettingsManager.updateItem(k, value);
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
                    this.config.SourceSettingsManager.updateItem(k, value);
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

            if (layer === undefined) {
                layer = this.config.ControlSettings.layer;
            }

            let updated = this.settingsManager.updateData(layer, data);
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
                this.presetMan.setChanged(this.config.ControlSettings.layer+1, true);
            }
        }

        /**
         *
         * @param layer
         * @param ctrl
         */
        addShaderPass(layer, ctrl) {
            if (layer === undefined) {
                layer = this.config.ControlSettings.layer;
            }

            let passes = this.settingsManager.get(layer, 'passes');
            let pass = {};
            pass[ctrl.name] = ctrl.getShader();
            passes.addShaderPass(pass);

            this.updateUi(this.animationSettingsGui);

            let data = {passes: {shaders: passes.getShaderPasses()}};
            this.messaging.emitSettings(layer, data, false, false, false);
        }

        /**
         * todo: settingsManager
         */
        cleanShaderPasses() {

            let controlSet = this.settingsManager.get(this.config.ControlSettings.layer, 'passes');
            let passes = controlSet.getShaderPasses();

            for (let key in passes) {
                let sh = controlSet.getShader(key);
                if (!sh || sh.apply === false) {
                    controlSet.removeShaderPass(key);
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

            if (typeof value !== 'object') {
                HC.log(item, value);
                this.explainPlugin(item, value, HC);
            }

            if (item === 'beat') {
                value = this.beatKeeper.trigger(value);
            }

            let tValue = value;
            value = this.config.ControlSettingsManager.updateItem(item, value);

            if (typeof value === 'function') { // value never can be a function
                value = tValue;
            }

            if (item === 'layer') {
                this.updateSettings(value, this.settingsManager.prepareLayer(value), true, false, true);
                this.presetMan.setSelected(value+1, true);
                HC.log(item, value+1);

                let config = {
                    action: 'attr',
                    query: '#layer',
                    key: 'data-mnemonic',
                    value: value + 1
                };

                this.messaging.onAttr(config);

            } else if (item === 'reset') {
                if (value && force) {
                    this.settingsManager.reset(this.config.ControlSettings.shuffleable.toIntArray((it)=>{return parseInt(it)-1;}));
                }
            }

            if (forward) {
                let data = {};
                data[item] = value;
                this.messaging.emitControls(data, true, false, force);
            }

            if (display !== false) {

                if (item.match(/_(sequence|sample|source)/)) {
                    alert('now! line number->console');
                    console.log('now!');
                    this.updateData();

                } else if (item === 'monitor') {
                    this.monitor.activate(value);
                }

                this.updateUi(this.controlSettingsGui);
            }

            if (item === 'session' && value !== _HASH) {
                document.location.hash = value;
                document.location.reload();
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

            if (typeof value !== 'object') {
                HC.log(item, value);
                // this.explainPlugin(item, value);
            }

            value = this.config.DisplaySettingsManager.updateItem(item, value);

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

            if (typeof value !== 'object') {
                HC.log(item, value);
                // this.explainPlugin(item, value);
            }

            value = this.config.SourceSettingsManager.updateItem(item, value);

            if (display !== false) {

                if (item.match(/_(start|end|sequence|input|source)$/)) {
                    this.updateData();

                } else if (item.match(/_(enabled)/)) {
                    if (!value) { // set record to false if enabled == false
                        let smp = HC.numberExtract(item, 'sample');
                        this.updateSource(getSampleRecordKey(smp), false, true, true, false);
                        this.updateThumbs();
                    }

                } else if (item.match(/_(load)/)) {
                    let smp = HC.numberExtract(item, 'sample');
                    this.loadClip(smp);
                }

                this.updateUi(this.sourceSettingsGui);
                this.updateUi(this.sequenceSettingsGui);
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
                    if (key in this.config) {
                        let sec = data.data[key];
                        for (let tkey in sec) {
                            this.config[key][tkey] = sec[tkey];
                        }
                    }
                }
                this.updateUi(this.sourceSettingsGui);
            }

            HC.TimeoutManager.add('updateData', SKIP_TEN_FRAMES, () => {
                this.updateSequenceUi();
                this.updateThumbs();
            });
        }

        /**
         *
         */
        updateSequenceUi() {
            if (this.config.SourceValues && this.config.SourceValues.sequence) {
                for (let seq = 0; seq < this.config.SourceValues.sequence.length; seq++) {
                    HC.EventManager.fireEventId(EVENT_CLIP_UPDATE, seq);
                    HC.EventManager.fireEventId(EVENT_CLIP_INDICATOR_UPDATE, seq);
                }
            }
        }

        /**
         *
         * @param data
         */
        updateMidi(data) {
            if (this.midi) {
                if (data.command === 'glow') {
                    this.midi.glow(data.data, data.conf);

                } else if (data.command === 'off') {
                    this.midi.off(data.data);
                }
            }
        }

        /**
         *
         * @param item
         * @param value
         * @param group
         */
        setAllDisplaysTo(item, value, group) {
            let increment = value === false;

            if (group) {
                group = this.config.SourceSettings[group].toIntArray();
            } else {
                group = [];
            }

            let updates = {};
            for (let i = 0; i < this.config.DisplayValues.display.length; i++) {

                // skip if group defined and index not part of group
                if (group.length && group.indexOf(i) < 0) {
                    continue;
                }

                let n = 'display' + i;
                let nv = n + '_visible';
                if (this.config.DisplaySettings[nv]) {
                    let key = n + '_' + item;
                    let ns = n + '_static';
                    if (!this.config.DisplaySettings[ns]) {
                        if (increment) {
                            value = this.config.SourceSettings[n + '_' + item];
                            value++;
                            if (value >= this.config.SourceValues[item].length) {
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
         * @param shuffleable
         * @returns {Promise}
         */
        syncLayers(shuffleable) {
            return new Promise((resolve, reject) => {
                let calls = [];
                for (let layer = 0; layer < this.config.ControlValues.layers; layer++) {
                    if (!shuffleable || -1 === shuffleable.indexOf(layer+1)) {
                        calls.push((_synced) => {
                            HC.TimeoutManager.add('syncLayer.' + layer, SKIP_TWO_FRAMES, () => {
                                this.syncLayer(layer, _synced);
                            });
                        });
                    }
                }

                calls.push((_synced) => {
                    HC.log('layer', 1);
                    this.updateControl('layer', 0, true, true, false);
                    _synced();
                });

                HC.TimeoutManager.chainExecuteCalls(calls, resolve);
            });
        }

        /**
         *
         */
        pushSources() {
            this._bypassMonitor(new Promise((resolve, reject) => {
                this.messaging.emitSources(this.config.SourceSettingsManager.prepareFlat(), true, true, false, resolve);
            }));
        }

        pushLayers() {
            this._bypassMonitor(this.syncLayers());
        }

        resetShaders(all) {
            return new Promise((resolve, reject) => {
                let calls = [];
                let layers = all ? Object.values(this.config.ControlValues.layer).map(x => x - 1) : [this.config.ControlSettings.layer];
                for (let key in layers) {
                    let layer = layers[key];
                    calls.push((_synced) => {
                        HC.TimeoutManager.add('syncLayer.' + layer, SKIP_TWO_FRAMES, () => {
                            this.resetShader(layer, _synced)
                        });
                    });
                }

                HC.TimeoutManager.chainExecuteCalls(calls, resolve);
            });
        }

        resetShader(layer, callback) {
            this.settingsManager.update(layer, 'passes', 'shaders', []);
            let data = this.settingsManager.get(layer, 'passes').prepare();
            this.updateSettings(layer, data, false, false, true);
            HC.log('reset_shader', layer+1);
            this.messaging.emitSettings(layer, data, false, false, true, callback);
        }

        /**
         *
         * @param promise {Promise}
         * @private
         */
        _bypassMonitor(promise) {
            let _done = false;
            this.midi.loading(() => {
                return _done;
            });
            let monitorStatus = this.config.ControlSettings.monitor;
            this.updateControl('monitor', false, false, true, false);
            promise.finally(() => {
                this.updateControl('monitor', monitorStatus, false, true, false);
                _done = true;
            });
        }

        /**
         *
         * @param layer
         * @param callback
         */
        syncLayer(layer, callback) {
            let settings = this.settingsManager.prepareLayer(layer);

            if (settings) {
                HC.log('sync_layer', layer+1);
                this.messaging.emitSettings(layer, settings, true, false, true, callback);

            } else if (callback) {
                callback();
            }
        }

        /**
         *
         */
        refreshLayersUi() {
            let preset = [];

            for (let layer = 0; layer < this.config.ControlValues.layers; layer++) {
                if (this.settingsManager.layers[layer]) {
                    let l = this.settingsManager.getLayer(layer);
                    if (this.config.shuffleable(layer+1) && !this.settingsManager.isDefault(l)) {
                        preset.push(layer+1);
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
                let cs = this.settingsManager.get(this.config.ControlSettings.layer, set);
                if (cs) {
                    cs.reset();
                    let data = cs.prepare();
                    this.updateSetting(this.config.ControlSettings.layer, data, true, true, false);
                }
            }
        }

        /**
         * reset all of all settings
         */
        fullReset() {
            let _done = false;
            this.midi.loading(() => {
                return _done;
            });
            let session = this.config.ControlSettings.session;
            assetman.disposeAll();
            this.presetMan.reload();
            this.presetMan.resetStatus();
            this.settingsManager.reset();
            this.config.SourceSettingsManager.reset();
            this.config.ControlSettingsManager.reset();
            this.config.DisplaySettingsManager.reset();

            let sources = this.config.SourceSettingsManager.prepareFlat();
            let controls = this.config.ControlSettingsManager.prepareFlat();
            let displays = this.config.DisplaySettingsManager.prepareFlat();

            controls.session = session;

            this.messaging.emitSources(sources, true, false, true);
            this.messaging.emitControls(controls, true, false, true);
            this.messaging.emitDisplays(displays, true, false, true);
            this.updateSources(sources, true, true, true);
            this.updateControls(controls, true, true, true);
            this.updateDisplays(displays, true, true, true);

            this.syncLayers().finally(() => {
                this._checkDisplayVisibility();
                _done = true;
            });
        }

        /**
         *
         * @private
         */
        _checkDisplayVisibility() {
            if (!this.config.DisplaySettings.display0_visible) {
                this.updateDisplay('display0_visible', true, true, true, false);
            }
        }

        /**
         * reset non shuffleable layers
         * @returns {Promise}
         */
        resetLayers() {
            let shuffleable = this.config.ControlSettings.shuffleable.toIntArray((it)=>{return parseInt(it)-1;});
            this.settingsManager.reset(shuffleable);
            shuffleable = this.config.ControlSettings.shuffleable.toIntArray();
            this.presetMan.resetStatus(shuffleable);
            return this.syncLayers(shuffleable);
        }

        /**
         *
         * @param layer
         * @param callback
         */
        resetLayer(layer, callback) {
            this.settingsManager.resetLayer(layer);
            this.syncLayer(layer, callback);
        }
    }
}
