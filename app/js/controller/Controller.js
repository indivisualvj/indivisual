/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {Program} from "../shared/Program";
import {TimeoutManager} from "../manager/TimeoutManager";
import {EventManager} from "../manager/EventManager";
import {LayeredControlSetManager} from "../manager/LayeredControlSetManager";
import {PreviewManager} from "../manager/PreviewManager";
import {Midi} from "./Midi";
import {PropertyUi} from "./ui/PropertyUi";
import {StatusBar} from "./ui/StatusBar";
import {DisplaySettingsUi} from "./ui/DisplaySettingsUi";
import {AnimationSettingsUi} from "./ui/AnimationSettingsUi";
import {PresetManager} from "./PresetManager";
import {ControlControllerUi} from "./ui/controlset/ControlControllerUi";
import {DisplayControllerUi} from "./ui/controlset/DisplayControllerUi";
import {SourceControllerUi} from "./ui/controlset/SourceControllerUi";
import {SequenceControllerUi} from "./ui/controlset/SequenceControllerUi";
import {SampleBar} from "./ui/SampleBar";
import {BeatKeeper} from "../shared/BeatKeeper";
import {SourceManager} from "../manager/SourceManager";
import {Messaging} from "../shared/Messaging";
import {ShaderPassUi} from "./ui/ShaderPassUi";
import {AssetManager} from "../manager/AssetManager";
import {Logger} from "../shared/Logger";
import {PluginManager} from "../manager/PluginManager";

class Controller extends Program {

    /**
     * @type {PropertyUi[]}
     */
    guis;

    /**
     * @type {PropertyUi}
     */
    controlSettingsGui;

    /**
     * @type {DisplaySettingsUi}
     */
    displaySettingsGui;

    /**
     * @type {PropertyUi}
     */
    sourceSettingsGui;

    /**
     * @type {AnimationSettingsUi}
     */
    animationSettingsGui;

    /**
     * @type {PropertyUi}
     */
    sequenceSettingsGui;

    /**
     * @type {StatusBar}
     */
    statusBar;

    /**
     * @type {SampleBar}
     */
    sampleBar;

    /**
     * @type {PresetManager}
     */
    presetMan;

    /**
     * @type {PreviewManager}
     */
    previewManager;

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
     * @type {Midi}
     */
    midi;

    /**
     *
     * @param {Config}config
     * @param sets
     */
    init(config, sets) {
        this.config = config;

        this.settingsManager = new LayeredControlSetManager(config.AnimationValues, config);
        this.previewManager = new PreviewManager();
        this.previewManager.activate(false);
        this.midi = new Midi(this);

        this.controlSettingsGui = new PropertyUi('ControlSettings', 'control', false, config);
        this.displaySettingsGui = new DisplaySettingsUi('DisplaySettings', 'display', false, config);
        this.sourceSettingsGui = new PropertyUi('SourceSettings', 'source', false, config);
        this.animationSettingsGui = new AnimationSettingsUi('AnimationSettings', 'animation', false, config);
        this.sequenceSettingsGui = new PropertyUi('SequenceSettings', 'sequence', false, config);
        this.presetMan = new PresetManager('Presets', 'presets', this);
        this.statusBar = new StatusBar('StatusBar', 'status', true, config.DataStatus);

        this.guis = [
            this.controlSettingsGui,
            this.displaySettingsGui,
            this.sourceSettingsGui,
            this.animationSettingsGui,
            this.sequenceSettingsGui,
            this.presetMan.gui,
        ];
        this.beatKeeper = new BeatKeeper(null, this.config);
        this.sourceManager = new SourceManager(null, { config: this.config, sample: [] });

        let controlSets = sets.controlSets;
        this.config.ControlSettings.session = _HASH; // #uglyworkaround

        this.controlSettingsGui.addControllers(
            controlSets,
            ControlControllerUi
        );

        let displaySets = sets.displaySets;

        this.displaySettingsGui.addControllers(
            PluginManager.getDisplaySets(),
            displaySets,
            DisplayControllerUi
        );

        let sourceSets = sets.sourceSets;
        sourceSets.sequenceN.visible = false;
        sourceSets.sample.visible = false;
        this.sourceSettingsGui.addControllers(
            sourceSets,
            SourceControllerUi
        );

        sourceSets.sequenceN.visible = true;
        sourceSets.override.visible = false;
        sourceSets.source.visible = false;

        this.sequenceSettingsGui.addControllers(
            sourceSets,
            SequenceControllerUi
        );

        this.sampleBar = new SampleBar('SampleBar', 'sample', true, sets.sourceSets.sample, this);

        this.animationSettingsGui.addControllers(this.settingsManager.getGlobalProperties());
        this.animationSettingsGui.addPassesFolder(
            ShaderPassUi.onPasses,
            this.settingsManager.getGlobalProperties()['passes'],
            this.config.AnimationValues.shaders
        );

        this.openTreeByPath('controls');

        this.midi.init();
        this.loadSession();
        this.presetMan.reload();
        this.initEvents();
    }

    /**
     *
     */
    loadSession() {
        let syncing = true;
        this.midi.loading(() => {
            return syncing;
        })
        Messaging.sync((session) => {
            if ('controls' in session) {
                Logger.loading('controls', 'synced');
                let controls = session.controls;
                this.updateControls(controls, true, false, true);
            }
            if ('displays' in session) {
                Logger.loading('displays', 'synced');
                let displays = session.displays;
                this.updateDisplays(displays, true, false, true);
            }
            if ('sources' in session) {
                Logger.loading('sources', 'synced');
                let sources = session.sources;
                this.updateSources(sources, true, false, true);
            }
            if ('settings' in session) {
                Logger.loading('settings', 'synced');
                let settings = session.settings;
                for (let layer in settings) {
                    this.updateSettings(layer, settings[layer], true, false, true);
                }
            }

            syncing = false;
            this.updateControl('layer', this.config.ControlSettings.layer, true, false, false);

            Logger.loading(null, null,250);

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

            Messaging.emitSettings(i, data, false, false, true);

        }
    }

    /**
     *
     * @param item
     * @param value
     */
    shareSetting(item, value) {
        let mappings = LayeredControlSetManager.mappings(() => {return LayeredControlSetManager.initAll(this.config.AnimationValues);});
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
            Messaging.emitSettings(i, data, false, false, true);
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
            Messaging.emitSettings(layer, data, display, false, false);
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
        Messaging.emitSettings(layer, data, false, false, false);
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
            Logger.log(item, value);
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
            Logger.log(item, value+1);

            this.config.DataStatus.selected_layer = value+1;

        } else if (item === 'reset') {
            if (value && force) {
                this.settingsManager.reset(this.config.ControlSettings.shuffleable.toIntArray((it)=>{return parseInt(it)-1;}));
            }
        }

        if (forward) {
            let data = {};
            data[item] = value;
            Messaging.emitControls(data, true, false, force);
        }

        if (display !== false) {
            if (item === 'preview') {
                this.previewManager.activate(value);
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
            Logger.log(item, value);
            // this.explainPlugin(item, value);
        }

        value = this.config.DisplaySettingsManager.updateItem(item, value);

        if (item.match(/display\d+_visible/)) {
            this.showDisplayControls();
        }

        if (forward) {
            let data = {};
            data[item] = value;
            Messaging.emitDisplays(data, true, false, force);
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
            Logger.log(item, value);
            // this.explainPlugin(item, value);
        }

        value = this.config.SourceSettingsManager.updateItem(item, value);

        if (display !== false) {

            if (item.match(/sequence\d_(start|end)$/)) {
                this._fireClipIndicatorUpdate(numberExtract(item, 'sequence'));

            } else if (item.match(/sequence\d_(|input)$/)) {
                this._fireClipUpdate(numberExtract(item, 'sequence'));

            } else if (item.match(/_(enabled)/)) {
                if (!value) {
                    this._disableSample(numberExtract(item, 'sample'))
                }

            } else if (item.match(/_(load)/)) {
                let smp = numberExtract(item, 'sample');
                this.loadClip(smp);
            }

            this.updateUi(this.sourceSettingsGui);
            this.updateUi(this.sequenceSettingsGui);
        }

        if (forward) {
            let data = {};
            data[item] = value;
            Messaging.emitSources(data, true, false, force);
        }
    }

    /**
     *
     * @param data
     */
    updateData(data) {
        if (data && this.config) {
            let key = data.key;
            if (key in this.config) {
                let sec = data.data;
                for (let tkey in sec) {
                    this.config[key][tkey] = sec[tkey];
                }
            }
        }
    }

    /**
     *
     * @param {number}smp
     * @private
     */
    _disableSample(smp) {
        // set record to false if was enabled
        this.updateSource(getSampleRecordKey(smp), false, true, true, false);
        this._resetClip(smp)
        EventManager.fireEventId(EVENT_THUMB_UPDATE, smp, {});
    }

    /**
     *
     * @param {number}smp
     * @private
     */
    _resetClip(smp) {
        let key = getSampleKey(smp);
        if (this.config.DataSamples[key]) {
            let clip = this.config.DataSamples[key];
            clip.reset();
            delete this.config.DataSamples[key];
        }
    }

    /**
     *
     * @param seq
     * @private
     */
    _fireClipUpdate(seq) {
        let sample = this.sourceManager.getSampleBySequence(seq);
        let sampleKey = getSampleKey(sample);

        let enabled = this.sourceManager.getSampleEnabledBySequence(seq);
        let data = null;
        if (enabled && sampleKey in this.config.DataSamples) {
            data = this.config.DataSamples[sampleKey];
        }

        EventManager.fireEventId(EVENT_CLIP_UPDATE, seq, data);
    }

    /**
     *
     * @param seq
     * @private
     */
    _fireClipIndicatorUpdate(seq) {
        let sample = this.sourceManager.getSampleBySequence(seq);
        let sampleKey = getSampleKey(sample);

        let enabled = this.sourceManager.getSampleEnabledBySequence(seq);
        let data = null;
        if (enabled && sampleKey in this.config.DataSamples) {
            data = this.config.DataSamples[sampleKey];
        }

        EventManager.fireEventId(EVENT_CLIP_INDICATOR_UPDATE, seq, data);
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
        Messaging.emitSources(updates, true, true, false);
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
                        TimeoutManager.add('syncLayer.' + layer, SKIP_TWO_FRAMES, () => {
                            this.syncLayer(layer, _synced);
                        });
                    });
                }
            }

            calls.push((_synced) => {
                Logger.log('layer', 1);
                this.updateControl('layer', 0, true, true, false);
                _synced();
            });

            TimeoutManager.chainExecuteCalls(calls, resolve);
        });
    }

    /**
     *
     */
    pushSources() {
        this._bypassMonitor(new Promise((resolve, reject) => {
            Messaging.emitSources(this.config.SourceSettingsManager.prepareFlat(), true, true, false, resolve);
        }));
    }

    pushLayers() {
        this._bypassMonitor(this.syncLayers());
    }

    pushShaderPasses(layer, data) {
        layer = layer !== null ? layer : this.config.ControlSettings.layer;
        Messaging.emitSettings(layer, data, false, false, false);
    }

    resetShaders(all) {
        return new Promise((resolve, reject) => {
            let calls = [];
            let layers = all ? Object.values(this.config.ControlValues.layer).map(x => x - 1) : [this.config.ControlSettings.layer];
            for (let key in layers) {
                let layer = layers[key];
                calls.push((_synced) => {
                    TimeoutManager.add('syncLayer.' + layer, SKIP_TWO_FRAMES, () => {
                        this.resetShader(layer, _synced)
                    });
                });
            }

            TimeoutManager.chainExecuteCalls(calls, resolve);
        });
    }

    resetShader(layer, callback) {
        this.settingsManager.update(layer, 'passes', 'shaders', []);
        let data = this.settingsManager.get(layer, 'passes').prepare();
        this.updateSettings(layer, data, false, false, true);
        Logger.log('reset_shader', layer+1);
        Messaging.emitSettings(layer, data, false, false, true, callback);
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
        let previewStatus = this.config.ControlSettings.preview;
        this.updateControl('preview', false, false, true, false);
        promise.finally(() => {
            this.updateControl('preview', previewStatus, false, true, false);
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
            Logger.log('sync_layer', layer+1);
            Messaging.emitSettings(layer, settings, true, false, true, callback);

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

        this.config.DataStatus.changed_layers = preset.join('|');
    }

    /**
     *
     * @param open {GuifyFolder}
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
        AssetManager.disposeAll();
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

        Messaging.emitSources(sources, true, false, true);
        Messaging.emitControls(controls, true, false, true);
        Messaging.emitDisplays(displays, true, false, true);
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
        let shuffleable = this.config.ControlSettings.shuffleable.toIntArray().map(x=>{return x-1;});
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

export {Controller as _Controller}