/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import {BeatKeeper} from "../shared/BeatKeeper";
import {AssetManager} from "./AssetManager";
import {ControlSetManager} from "../manager/ControlSetManager";
import {Messaging} from "./Messaging";
import {EventManager} from "../manager/EventManager";

class Config {

    /**
     * @type {ControlSetManager}
     */
    ControlSettingsManager;
    ControlSettings;
    ControlTypes;
    ControlValues;
    /**
     * @type {ControlSetManager}
     */
    DisplaySettingsManager;
    DisplaySettings;
    DisplayTypes;
    DisplayValues;
    /**
     * @type {ControlSetManager}
     */
    SourceSettingsManager;
    SourceSettings;
    SourceTypes;
    SourceValues;

    ShaderSettings;
    DataSamples;
    DataStatus;

    config = [
        {
            file: 'structure/AnimationValues.yml',
            callback: (data, finished) => {
                let settings = jsyaml.load(data.contents);

                this._loadAnimationPlugins(settings);
                this.ShaderSettings = this._loadShaderSettings(settings.shaders);
                this.Passes = [null];
                for (let sh in this.ShaderSettings) {
                    this.Passes.push(sh);
                }
                this._loadRhythms(settings);
                this.AnimationValues = settings;
                this.AnimationValues.shaders[''] = '';
                finished();
            }
        },
        {
            file: 'structure/ControlValues.yml',
            callback: (data, finished) => {
                let settings = jsyaml.load(data.contents);

                settings.layers = 20;
                settings.layer = {};
                for (let i = 0; i < settings.layers; i++) {
                    settings.layer[i] = i+1;
                }

                this._loadAudioPlugins(settings);
                this._loadShufflePlugins(settings);
                this._loadControlSets();
                settings.session[_HASH] = _HASH;

                this.ControlValues = settings;
                finished();
            }
        },
        {
            file: 'structure/DisplayValues.yml',
            callback: (data, finished) => {
                this.DisplayValues = jsyaml.load(data.contents);
                this._loadBorderModePlugins(this.DisplayValues);
                this._loadDisplayVisibilityPlugins(this.DisplayValues);
                finished();
            }
        },
        {
            file: 'structure/SourceValues.yml',
            callback: (data, finished) => {
                this.SourceValues = jsyaml.load(data.contents);
                this._loadDisplaySourcePlugins(this.SourceValues);
                finished();
            }
        },
        {
            file: 'structure/MidiController.yml',
            callback: (data, finished) => {

                let settings = jsyaml.load(data.contents);

                // create MIDI_ constants
                let constants = settings.Default.constants;
                for (let c in constants) {
                    window[c] = constants[c];
                }

                this.MidiController = settings;
                finished();
            }
        },
        {
            action: 'files',
            base: '.',
            file: SESSION_DIR,
            callback: (files, finished) => {
                for (let i = 0; i < files.length; i++) {
                    let f = files[i];
                    this.ControlValues.session[f.name] = f.name;
                }

                finished();
            }
        },
        {
            action: 'files',
            base: '.',
            file: VIDEO_DIR,
            callback: (files, finished) => {

                AssetManager.addVideos(files, 'name');

                finished();
            }
        },
        {
            action: 'files',
            base: '.',
            file: IMAGE_DIR,
            callback: (files, finished) => {
                let images = AssetManager.addImages(files, 'name');
                // add images into AnimationValues by name
                for (let i in images) {
                    this.AnimationValues.material_input[i] = i;
                    this.AnimationValues.background_input[i] = i;
                }

                finished();
            }
        },
        {
            action: 'files',
            base: '.',
            file: CUBE_DIR,
            callback: (files, finished) => {
                let cubes = AssetManager.addCubes(files, 'name');
                // add cubes into AnimationValues by name
                for (let i in cubes) {
                    this.AnimationValues.background_input[i] = name = i + '.cube';
                }

                finished();
            }
        }
    ];

    /**
     *
     * @param callback
     */
    loadConfig(callback) {

        let resources = this.config;

        let _load = (index, _callback) => {

            if (index > resources.length - 1) {
                _callback();
                return;
            }
            let rsc = resources[index];
            let action = 'config';
            if (rsc.action) {
                action = rsc.action;
            }
            let file = HC.filePath(rsc.base || APP_DIR, rsc.file);
            Messaging._emit({action: action, file: file, name: rsc.name}, (data) => {
                rsc.callback(data, () => {
                    _load(index + 1, _callback);
                });
            });
        };

        _load(0, () => {
            callback(this);
        });
    }

    initControlSets() {
        let controlSets = this.initControlControlSets();
        this.ControlSettingsManager = new ControlSetManager(controlSets);
        this.ControlSettings = this.ControlSettingsManager.settingsProxy();
        this.ControlTypes = this.ControlSettingsManager.typesProxy();
        this.ControlValues = this.ControlSettingsManager.valuesProxy(this.ControlValues);

        this.ControlSettings.session = _HASH; // ugly workaround

        let displaySets = this.initDisplayControlSets();
        this.DisplaySettingsManager = new ControlSetManager(displaySets);
        this.DisplaySettings = this.DisplaySettingsManager.settingsProxy();
        this.DisplayTypes = this.DisplaySettingsManager.typesProxy();
        this.DisplayValues = this.DisplaySettingsManager.valuesProxy(this.DisplayValues);

        let sourceSets = this.initSourceControlSets();
        this.SourceSettingsManager = new ControlSetManager(sourceSets);
        this.SourceSettings = this.SourceSettingsManager.settingsProxy();
        this.SourceTypes = this.SourceSettingsManager.typesProxy();
        this.SourceValues = this.SourceSettingsManager.valuesProxy(this.SourceValues);

        this.DataSamples = {};
        this.DataStatus = {
            bpm: 0,
            beats: 0,
            duration: 0,
            pitch: 0,
            fps: 0,
            rms: 0,
            input_level: 0,
            peak_bpm: 0,
            selected_layer: 0,
            rendered_layers: '',
            changed_layers: '',
        };

        return {
            controlSets: controlSets,
            displaySets: displaySets,
            sourceSets: sourceSets,
        };
    }

    /**
     *
     */
    initControlControlSets() {
        return this._initControlSets(HC.ControlController, this.ControlValues);
    }

    /**
     *
     */
    initDisplayControlSets() {
        let instances = {};

        for (let cs in HC.DisplayController) {
            let group = HC.DisplayController[cs];
            for (let s in group) {
                let set = group[s];
                let inst = new set(s, this, Messaging, EventManager);
                inst.init(this.DisplayValues);
                instances[cs + '.' + s] = inst;
            }
        }

        return instances;
    }

    /**
     *
     */
    initSourceControlSets() {
        return this._initControlSets(HC.SourceController, this.SourceValues);
    }

    shuffleable (index) {
        let shuffleable = this.ControlSettings.shuffleable.toIntArray();
        return shuffleable.length === 0 || shuffleable.indexOf(index) !== -1;
    }

    /**
     *
     */
    _initControlSets(tree, values) {
        let instances = {};

        for (let cs in tree) {
            let set = tree[cs];
            /*** @type {HC.ControlSet} */
            let inst = new set(cs, this, Messaging, EventManager);
            inst.init(values);
            instances[cs] = inst;
        }

        return instances;
    }

    /**
     *
     * @param settings
     * @param section
     * @param plugins
     * @param className
     * @private
     */
    _loadPlugins(settings, section, plugins, className) {

        let pluginKeys = Object.keys(plugins);

        pluginKeys.sort(this._sort(plugins, className||'Plugin'));

        for (let i = 0; i < pluginKeys.length; i++) {

            let pluginKey = pluginKeys[i];
            let plugin = plugins[pluginKey];
            let name = plugin.name || pluginKey;

            if (name === (className||'Plugin')) {
                name = pluginKey;
            }
            if (!(section in settings)) {
                settings[section] = {};
            }

            settings[section][pluginKey] = name;

        }
    }

    /**
     *
     * @private
     */
    _loadControlSets() {

        this.ControlSets = {};
        let plugins = HC.control_set;
        let keys = Object.keys(plugins);

        keys.sort(this._sort(plugins, 'ControlSet'));

        for (let i = 0; i < keys.length; i++) {

            let key = keys[i];
            let plugin = HC.control_set[key];
            let name = plugin._name || key;

            if (name === 'ControlSet') {
                name = key;
            }

            this.ControlSets[key] = name;

        }
    }

    /**
     *
     * @param settings
     * @private
     */
    _loadAudioPlugins(settings) {
        this._loadPlugins(settings, 'audio', HC.AudioManager.plugins);
    }

    /**
     *
     * @param settings
     * @private
     */
    _loadShufflePlugins(settings) {
        this._loadPlugins(settings, 'shuffle_mode', HC.Renderer.shuffle_mode);
    }

    /**
     *
     * @param settings
     * @private
     */
    _loadBorderModePlugins(settings) {
        this._loadPlugins(settings, 'border_mode', HC.Display.border_mode);
    }

    /**
     *
     * @param settings
     * @private
     */
    _loadDisplayVisibilityPlugins(settings) {
        this._loadPlugins(settings, 'display_visibility', HC.Display.display_visibility);
    }

    /**
     *
     * @param settings
     * @private
     */
    _loadDisplaySourcePlugins(settings) {
        Object.assign(HC.plugins.override_background_mode, HC.plugins.override_material_input);
        this._loadPlugins(settings, 'display_source', HC.SourceManager.display_source);
    }


    /**
     *
     * @param settings
     * @private
     */
    _loadAnimationPlugins(settings) {

        Object.assign(HC.plugins.pattern_overlay, HC.plugins.pattern);

        let sectionKeys = Object.keys(HC.plugins);

        for (let pi = 0; pi < sectionKeys.length; pi++) {

            let section = sectionKeys[pi];

            // create plugin namespaces to work in
            HC.Shape.prototype.injected.plugins[section] = {};

            this._loadPlugins(settings, section, HC.plugins[section]);
        }
    }

    /**
     *
     * @param settings
     * @private
     */
    _loadRhythms(settings) {
        let speeds = BeatKeeper.initSpeeds();
        settings.rhythm = {};
        for (let key in speeds) {
            if (speeds[key].visible !== false) {
                settings.rhythm[key] = key;
            }
        }
    }

    /**
     *
     * @param values
     * @private
     */
    _loadShaderSettings(values) {
        let settings = {};
        let keys = Object.keys(values);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let plug = HC.plugins.shaders[key];
            settings[key] = plug.settings || {};
        }

        return settings;
    }

    /**
     *
     * @param plugins
     * @param className
     * @returns {(function(*, *): (*))|*}
     * @private
     */
    _sort (plugins, className) {
        return (a, b) => {
            let ai = plugins[a].index || 99999;
            let bi = plugins[b].index || 99999;
            let an = plugins[a].name || a;
            let bn = plugins[b].name || b;

            if (an === className) {
                an = a;
            }
            if (bn === className) {
                bn = b;
            }

            let cmpi = ai - bi;
            if (cmpi === 0) {
                return an.localeCompare(bn);
            }
            return cmpi;
        }
    }

    getEventManager() {
        return EventManager;
    }

    getAssetManager() {
        return AssetManager;
    }

    getMessaging() {
        return Messaging;
    }


}
export {Config};
