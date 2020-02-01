/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.Statics = HC.Statics || {};

// todo HC.Config to be CLASS and .loadResources instead of _setup.js loadResources !? move all statics calls to animation.config. / controller.config.

{
    /**
     *
     * @type {HC.Config}
     */
    HC.Config = class Config {

        /**
         * @type {HC.Messaging}
         */
        messaging;

        /**
         * @var {HC.ControlSetsManager}
         */
        ControlSettingsManager;
        ControlSettings;
        ControlTypes;
        ControlValues;
        /**
         * @var {HC.ControlSetsManager}
         */
        DisplaySettingsManager;
        DisplaySettings;
        DisplayTypes;
        DisplayValues;
        /**
         * @var {HC.ControlSetsManager}
         */
        SourceSettingsManager;
        SourceSettings;
        SourceTypes;
        SourceValues;

        DataSettings;

        /**
         *
         * @type {boolean}
         */
        ctrlKey = false;
        /**
         *
         * @type {boolean}
         */
        altKey = false;
        /**
         *
         * @type {boolean}
         */
        shiftKey = false;

        config = [
            {
                file: 'structure/AnimationValues.yml',
                callback: (data, finished) => {
                    let settings = jsyaml.load(data.contents);

                    this._loadAnimationPlugins(settings);
                    statics.ShaderSettings = this._loadShaderSettings(settings.shaders);
                    statics.Passes = [null];
                    for (let sh in statics.ShaderSettings) {
                        statics.Passes.push(sh);
                    }
                    this._loadRhythms(settings);

                    statics.AnimationValues = settings;
                    finished();
                }
            },
            {
                file: 'structure/ControlValues.yml',
                callback: (data, finished) => {
                    let settings = jsyaml.load(data.contents);

                    this._loadAudioPlugins(settings);
                    this._loadShufflePlugins(settings);
                    this._loadControlSets();
                    settings.session[_HASH] = _HASH;

                    statics.ControlValues = settings;
                    finished();
                }
            },
            {
                file: 'structure/DisplayValues.yml',
                callback: (data, finished) => {
                    statics.DisplayValues = jsyaml.load(data.contents);
                    this._loadBorderModePlugins(statics.DisplayValues);
                    finished();
                }
            },
            {
                file: 'structure/SourceValues.yml',
                callback: (data, finished) => {
                    statics.SourceValues = jsyaml.load(data.contents);
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
                        let co = constants[c];
                        window[c] = co;
                    }

                    statics.MidiController = settings;
                    finished();
                }
            },
            {
                action: 'files',
                base: '.',
                file: SESSION_DIR,
                callback: function (files, finished) {
                    for (let i = 0; i < files.length; i++) {
                        let f = files[i];
                        statics.ControlValues.session[f.name] = f.name;
                    }

                    finished();
                }
            },
            {
                action: 'files',
                base: '.',
                file: VIDEO_DIR,
                callback: function (files, finished) {

                    assetman.addVideos(files, 'name');

                    finished();
                }
            },
            {
                action: 'files',
                base: '.',
                file: IMAGE_DIR,
                callback: function (files, finished) {
                    let images = assetman.addImages(files, 'name');
                    // add images into AnimationValues by name
                    for (let i in images) {
                        statics.AnimationValues.material_input[i] = i;
                        statics.AnimationValues.background_input[i] = i;
                    }

                    finished();
                }
            },
            {
                action: 'files',
                base: '.',
                file: CUBE_DIR,
                callback: function (files, finished) {
                    let cubes = assetman.addCubes(files, 'name');
                    // add cubes into AnimationValues by name
                    for (let i in cubes) {
                        let name = i + '.cube';
                        statics.AnimationValues.background_input[i] = name;
                    }

                    finished();
                }
            }
        ];

        /**
         *
         * @param {HC.Messaging} messaging
         */
        constructor(messaging) {
            this.messaging = messaging;
        }

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
                let action = 'get';
                if (rsc.action) {
                    action = rsc.action;
                }
                let file = filePath(rsc.base || APP_DIR, rsc.file);
                this.messaging._emit({action: action, file: file, name: rsc.name}, (data) => {
                    rsc.callback(data, () => {
                        _load(index + 1, _callback);
                    });
                });
            };

            _load(0, function () {
                callback();
            });
        }

        initControlSets() {
            let controlSets = this.initControlControlSets();
            this.ControlSettingsManager = new HC.ControlSetsManager(controlSets);
            this.ControlSettings = this.ControlSettingsManager.settingsProxy();
            this.ControlTypes = this.ControlSettingsManager.typesProxy();
            this.ControlValues = this.ControlSettingsManager.valuesProxy(statics.ControlValues);

            this.ControlSettings.session = _HASH; // ugly workaround

            let displaySets = this.initDisplayControlSets();
            this.DisplaySettingsManager = new HC.ControlSetsManager(displaySets);
            this.DisplaySettings = this.DisplaySettingsManager.settingsProxy();
            this.DisplayTypes = this.DisplaySettingsManager.typesProxy();
            this.DisplayValues = this.DisplaySettingsManager.valuesProxy(statics.DisplayValues);

            let sourceSets = this.initSourceControlSets();
            this.SourceSettingsManager = new HC.ControlSetsManager(sourceSets);
            this.SourceSettings = this.SourceSettingsManager.settingsProxy();
            this.SourceTypes = this.SourceSettingsManager.typesProxy();
            this.SourceValues = this.SourceSettingsManager.valuesProxy(statics.SourceValues);

            this.DataSettings = {};

            statics.ControlSettingsManager = this.ControlSettingsManager;
            statics.ControlSettings = this.ControlSettings;
            statics.ControlTypes = this.ControlTypes;
            statics.ControlValues = this.ControlValues;
            statics.DisplaySettingsManager = this.DisplaySettingsManager;
            statics.DisplaySettings = this.DisplaySettings;
            statics.DisplayTypes = this.DisplayTypes;
            statics.DisplayValues = this.DisplayValues;
            statics.SourceSettingsManager = this.SourceSettingsManager;
            statics.SourceSettings = this.SourceSettings;
            statics.SourceTypes = this.SourceTypes;
            statics.SourceValues = this.SourceValues;
            statics.DataSettings = this.DataSettings;

            this.MidiController = statics.MidiController; // fixme do not load anything to statics once statics is dead
            this.Passes = statics.Passes;
            this.AnimationValues = statics.AnimationValues;
            
            return {
                controlSets: controlSets,
                displaySets: displaySets,
                sourceSets: sourceSets
            };
        }

        /**
         *
         */
        initControlControlSets() {
            let instances = {};

            for (let cs in HC.ControlController) {
                let set = HC.ControlController[cs];
                let inst = new set(cs);
                inst.init(statics.ControlValues);
                instances[cs] = inst;
            }

            return instances;
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
                    let inst = new set(s);
                    inst.init(statics.DisplayValues);
                    instances[cs + '.' + s] = inst;
                }
            }

            return instances;
        }

        /**
         *
         */
        initSourceControlSets() {
            let instances = {};

            for (let cs in HC.SourceController) {
                let set = HC.SourceController[cs];
                let inst = new set(cs);
                inst.init(statics.SourceValues);
                instances[cs] = inst;
            }

            return instances;
        }

        /**
         *
         * @param settings
         * @param section
         * @param plugins
         * @private
         */
        _loadPlugins(settings, section, plugins) {

            let pluginKeys = Object.keys(plugins);

            pluginKeys.sort(this._sort(plugins, 'Plugin'));

            for (let i = 0; i < pluginKeys.length; i++) {

                let pluginKey = pluginKeys[i];
                let plugin = plugins[pluginKey];
                let name = plugin.name || pluginKey;

                if (name == 'Plugin') {
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

            statics.ControlSets = {};
            let plugins = HC.controls;
            let keys = Object.keys(plugins);

            keys.sort(this._sort(plugins, 'ControlSet'));

            for (let i = 0; i < keys.length; i++) {

                let key = keys[i];
                let plugin = HC.controls[key];
                let name = plugin.name || key;

                if (name == 'ControlSet') {
                    name = key;
                }

                statics.ControlSets[key] = name;

            }
        }

        /**
         *
         * @param settings
         * @private
         */
        _loadAudioPlugins(settings) {
            this._loadPlugins(settings, 'audio', HC.audio);
        }

        /**
         *
         * @param settings
         * @private
         */
        _loadShufflePlugins(settings) {
            this._loadPlugins(settings, 'shuffle_mode', HC.shuffle_mode);
        }

        /**
         *
         * @param settings
         * @private
         */
        _loadBorderModePlugins(settings) {
            this._loadPlugins(settings, 'border_mode', HC.Display.border_modes);
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
            let speeds = HC.BeatKeeper.initSpeeds();
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
         * @returns {function(...[*]=)}
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
                if (cmpi == 0) {
                    return an.localeCompare(bn);
                }
                return cmpi;
            }
        }
    }
}
