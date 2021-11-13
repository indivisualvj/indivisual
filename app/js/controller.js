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

    let controller = new HC.Controller(G_INSTANCE);
    messaging = new HC.Messaging(controller);
    let config = new HC.Config(messaging);
    controller.config = config;

    messaging.connect(function (reconnect, controller) {

        setTimeout(() => {
            document.querySelector('iframe.monitor').setAttribute('src', 'monitor.html#' + messaging.sid);
        }, 1500);

        HC.log(controller.name, 'connected', true, true);

        if (!reconnect) {

            controller.config.loadConfig(function () {

                let sets = controller.config.initControlSets();
                let cm = new HC.LayeredControlSetsManager([], controller.config.AnimationValues);
                controller.settingsManager = cm;
                controller.init(sets);
                controller.loadSession();
                controller.initKeyboard();
                controller.initLogEvents();
                controller.midi = new HC.Midi(controller);
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
    HC.Controller = class Controller extends HC.Program {

        /**
         * @type {HC.Guify[]}
         */
        guis;

        /**
         * @type {HC.SourceControllerSequence[]}
         */
        clips;

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
         * @type {{}}
         */
        thumbTimeouts = {
            samples: null,
        };

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
         * @param name
         */
        constructor(name) {
            super(name);
            this.clips = [];
        }

        /**
         *
         * @param sets
         */
        init(sets) {

            this.monitor = new HC.Monitor();
            this.monitor.activate(false);
            this.controlSettingsGui = new HC.Guify('ControlSettings', true);
            this.displaySettingsGui = new HC.Guify('DisplaySettings');
            this.sourceSettingsGui = new HC.Guify('SourceSettings');
            this.sequenceSettingsGui = new HC.Guify('SequenceSettings');
            this.animationSettingsGui = new HC.Guify('AnimationSettings');
            // this.configurationSettingsGui = new HC.Guify('ConfigurationSettings');

            this.guis = [
                this.controlSettingsGui,
                this.displaySettingsGui,
                this.sourceSettingsGui,
                this.animationSettingsGui,
                this.sequenceSettingsGui,
            ];
            this.beatKeeper = new HC.BeatKeeper(null, this.config);
            this.sourceManager = new HC.SourceManager(null, { config: this.config, sample: [] });
            this.explorer = new HC.Explorer(this);

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
            sourceSets.lighting.visible = false;
            sourceSets.sample.visible = false;
            sourceSets.source.visible = false;

            this.addGuifyControllers(
                sourceSets,
                HC.SourceControllerUi,
                this.sequenceSettingsGui,
                (folder) => {
                    this.clips.push(new HC.SourceControllerSequence(this, folder));
                }
            );

            // this.addConfigurationSettings();
            this.initStatusBar();
            this.initThumbs();

            this.addAnimationControllers(this.settingsManager.getGlobalProperties());
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
                        console.log(settings[k]);
                    }
                }
                if ('data' in session) {
                    HC.log('data', 'synced');
                    this.updateData();
                }

                this.updateControl('layer', this.config.ControlSettings.layer, true, false, false);
            });
        }

        /**
         *
         * @param layer {number}
         * @param data {Object}
         * @param keepPasses {boolean}
         */
        migrateSettings0(layer, data, keepPasses) {

            let mappings = HC.LayeredControlSetsManager.mappings(() => {return HC.LayeredControlSetsManager.initAll(this.config.AnimationValues);});

            let passes = this.settingsManager.get(layer, 'passes');
            if (keepPasses !== true) {
                passes.removeShaderPasses();
            }

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
                            let pass = {};
                            pass[name] = sh;
                            passes.addShaderPass(pass);
                        }
                    }
                } else {
                    let set = mappings[k];
                    if (set) {
                        this.settingsManager.update(layer, set, k, value);
                    }
                }

            }
            this.updateUi(this.animationSettingsGui);
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

                if (this.settingsManager.layers[i]._preset) {
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
                this.explorer.setChanged(this.config.ControlSettings.layer+1, true);
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
         *
         */
        cleanShaderPasses() {

            let cs = this.settingsManager.get(this.config.ControlSettings.layer, 'passes');
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

            if (item === 'beat') {
                value = this.beatKeeper.trigger(value);
            }

            let tValue = value;
            value = this.config.ControlSettingsManager.updateItem(item, value);

            if (item === 'layer') {
                this.updateSettings(value, this.settingsManager.prepareLayer(value), true, false, true);

                this.explorer.setSelected(value+1, true);

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
                    this.refreshLayerInfo();
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

            if (typeof value != 'object') {
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

            if (typeof value != 'object') {
                HC.log(item, value);
                // this.explainPlugin(item, value);
            }

            value = this.config.SourceSettingsManager.updateItem(item, value);

            if (display !== false) {

                if (item.match(/_(start|end|sequence|input|source)$/)) {
                    this.updateData();

                } else if (item.match(/_(enabled)/)) {
                    if (!value) { // set record to false if enabled == false
                        let smp = numberExtract(item, 'sample');
                        this.updateSource(getSampleRecordKey(smp), false, true, true, false);
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
                    if (key in this.config) {
                        let sec = data.data[key];
                        for (let tkey in sec) {
                            let type = sec[tkey];
                            this.config[key][tkey] = type;
                        }
                    }
                }
                this.updateUi(this.sourceSettingsGui);
            }

            clearTimeout(this.thumbTimeouts.samples);

            this.thumbTimeouts.samples = setTimeout(() => {
                requestAnimationFrame(() => {
                    this.updateSequenceUi();
                    this.updateThumbs();
                });

            }, 125);
        }

        /**
         *
         */
        updateSequenceUi() {
            if (this.config.SourceValues && this.config.SourceValues.sequence) {
                for (let seq = 0; seq < this.config.SourceValues.sequence.length; seq++) {
                    requestAnimationFrame(() => {
                        this.updateClip(seq);
                        this.updateIndicator(seq);
                    });
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

                } else if (data.command === 'clock') {
                    this.midi.clock(data.data, data.conf);
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
         * question push even if monitor is enabled? how do it nicely?
         */
        syncLayers() {
            for (let layer in this.settingsManager.layers) {
                let to = parseInt(layer) * 150;

                let st = (layer, to) => {
                    setTimeout(() => {
                        this.syncLayer(layer);
                    }, to);
                };
                st(layer, to);
            }
            let to = this.config.ControlValues.layers * 151;

            setTimeout(() => {
                this.updateControl('layer', this.config.ControlSettings.layer, true, true, true);
            }, to);
        }

        /**
         *
         */
        pushSources() {
            this.messaging.emitSources(this.config.SourceSettingsManager.prepareFlat(), true, true, false);
        }

        /**
         *
         * @param layer
         */
        syncLayer(layer) {
            let settings = this.settingsManager.prepareLayer(layer);

            if (settings) {
                this.messaging.emitSettings(layer, settings, true, false, true);
            }
        }

        /**
         *
         * @param name
         * @param data
         * @param layer
         */
        updatePreset(name, data, layer) {

            HC.log('preset', name);

            if (layer === undefined) {
                layer = this.config.ControlSettings.layer;
            }

            this.settingsManager.resetLayer(layer);

            if (!('info' in data)) {
                this.migrateSettings0(layer, data);

            // example!
            // } else if ('info' in data && data.info.version > 1.99) {
                // this.migrateSettings1(layer, data, true, false, true);

            } else {
                this.updateSettings(layer, data, false, false, true);
            }

            data = this.settingsManager.prepareLayer(layer);
            if (this.settingsManager.get(layer, 'info').hasTutorial()) {
                new HC.ScriptProcessor(this, name, Object.create(data.info.tutorial)).log();

                data.info.tutorial = {}; // todo tutorial will be deleted on savePreset
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

            for (let i = 0; i < this.config.ControlValues.layers; i++) {
                if (this.config.shuffleable(i+1) && !this.settingsManager.isDefault(i)) {
                    if (!('info' in data)) {

                        let shaders = {shaders: data.shaders};

                        this.migrateSettings0(i, shaders, true);

                    // example!
                    // } else if ('info' in data && data.info.version > 1.99) {
                    // this.migrateSettings1(layer, data, true, false, true);

                    } else {
                        let nu = data.passes.shaders;
                        let passes = this.settingsManager.get(i, 'passes');

                        for (let k in nu) {
                            passes.addShaderPass(nu[k]);
                        }
                    }

                    if (this.settingsManager.layers[i]._preset) {
                        this.explorer.setChanged(i+1, true);
                    }

                    this.messaging.emitSettings(i, this.settingsManager.prepareLayer(i), false, false, true);
                }
            }
        }

        /**
         *
         */
        refreshLayerInfo() {
            let preset = [];

            for (let i = 0; i < this.config.ControlValues.layers; i++) {
                if (this.settingsManager.layers[i]) {
                    let l = this.settingsManager.getLayer(i);
                    if (this.config.shuffleable(i+1) && !this.settingsManager.isDefault(l)) {
                        preset.push(i+1);
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
    }
}
