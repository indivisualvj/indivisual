DEBUG = true;

APP_DIR = 'app';
STORAGE_DIR = 'storage';
SAMPLE_DIR = 'samples';
SESSION_DIR = 'sessions';
ASSET_DIR = 'assets';
FONT_DIR = ASSET_DIR + '/fonts';
IMAGE_DIR = ASSET_DIR + '/images';
CUBE_DIR = ASSET_DIR + '/cubes';
VIDEO_DIR = ASSET_DIR + '/videos';

_HASH = document.location.hash ? document.location.hash.substr(1) : '';
_SERVER = 'server';
_CONTROLLER = 'controller';
_ANIMATION = 'animation';
_SETUP = 'setup';
_CLIENT = 'client';
_MONITOR = 'monitor';

IS_CONTROLLER = G_INSTANCE == _CONTROLLER;
IS_SETUP = G_INSTANCE == _SETUP;
IS_ANIMATION = G_INSTANCE == _ANIMATION || G_INSTANCE == _CLIENT;
IS_MONITOR = G_INSTANCE == _MONITOR;

MNEMONICS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
OSD_TIMEOUT = 2000;
RAD = Math.PI / 180;
DEG = 180 / Math.PI;
SQUARE_DIAMETER = (Math.sqrt(2 * 2 + 2 * 2) / 2);
ANTIALIAS = true;

HC.now = window.performance.now.bind(window.performance);
if (TWEEN) {
    TWEEN.now = HC.now;
}

/**
 *
 * @type {HC.AssetManager}
 */
assetman = new HC.AssetManager();

statics = {};

/**
 *
 * @param resources
 * @param callback
 */
function loadResources(resources, callback) {
    let _load = function (index, finished) {

        if (index > resources.length - 1) {
            finished();
            return;
        }
        let rsc = resources[index];
        let action = 'get';
        if (rsc.action) {
            action = rsc.action;
        }
        let file = filePath(rsc.base || APP_DIR, rsc.file);
        messaging._emit({action: action, file: file, name: rsc.name}, function (data) {
            rsc.callback(data, function () {
                _load(index + 1, finished);
            });
        });
    };

    let _setup = function (callback) {
        if (!(_HASH in statics.ControlValues.session)) {
            statics.ControlValues.session[_HASH] = _HASH;
        }

        callback();
    };

    _load(0, function () {
        _setup(callback);
    });
}

/**
 * setup operations are encapsulated into this function
 * @returns {*[]}
 */
function setupResources() {
    return [
        {
            file: 'structure/AnimationValues.yml',
            callback: function (data, finished) {
                let settings = jsyaml.load(data.contents);

                _loadAnimationPlugins(settings);
                statics.ShaderSettings = _loadShaderSettings(settings.shaders);
                statics.Passes = [null];
                for (let sh in statics.ShaderSettings) {
                    statics.Passes.push(sh);
                }
                _loadRhythms(settings);

                statics.AnimationValues = settings;
                finished();
            }
        },
        {
            file: 'structure/ControlValues.yml',
            callback: function (data, finished) {
                let settings = jsyaml.load(data.contents);

                _loadAudioPlugins(settings);
                _loadShufflePlugins(settings);
                _loadControlSets();

                statics.ControlValues = settings;
                finished();
            }
        },
        {
            file: 'structure/DisplayValues.yml',
            callback: function (data, finished) {
                statics.DisplayValues = jsyaml.load(data.contents);
                _loadBorderModePlugins(statics.DisplayValues);
                finished();
            }
        },
        {
            file: 'structure/SourceValues.yml',
            callback: function (data, finished) {
                statics.SourceValues = jsyaml.load(data.contents);
                finished();
            }
        },
        {
            file: 'structure/MidiController.yml',
            callback: function (data, finished) {

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
     * @param settings
     * @param section
     * @param plugins
     * @private
     */
    function _loadPlugins(settings, section, plugins) {

        let pluginKeys = Object.keys(plugins);

        pluginKeys.sort(function (a, b) {

            let ai = plugins[a].index || 99999;
            let bi = plugins[b].index || 99999;
            let an = plugins[a].name || a;
            let bn = plugins[b].name || b;

            if (an === 'Plugin') {
                an = a;
            }
            if (bn === 'Plugin') {
                bn = b;
            }

            let cmpi = ai - bi;
            if (cmpi == 0) {
                return an.localeCompare(bn);
            }
            return cmpi;
        });

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
     * @param settings
     * @param tree
     * @param section
     * @param plugins
     * @private
     */
    function _loadControlSets() {

        statics.ControlSets = {};
        let plugins = HC.controls;
        let keys = Object.keys(plugins);

        keys.sort(function (a, b) {

            let ai = plugins[a].index || 99999;
            let bi = plugins[b].index || 99999;
            let an = plugins[a].name || a;
            let bn = plugins[b].name || b;

            if (an === 'ControlSet') {
                an = a;
            }
            if (bn === 'ControlSet') {
                bn = b;
            }

            let cmpi = ai - bi;
            if (cmpi == 0) {
                return an.localeCompare(bn);
            }
            return cmpi;
        });

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
    function _loadAudioPlugins(settings) {
        _loadPlugins(settings, 'audio', HC.audio);
    }

    /**
     *
     * @param settings
     * @private
     */
    function _loadShufflePlugins(settings) {
        _loadPlugins(settings, 'shuffle_mode', HC.shuffle_mode);
    }

    /**
     *
     * @param settings
     * @private
     */
    function _loadBorderModePlugins(settings) {
        _loadPlugins(settings, 'border_mode', HC.Display.border_modes);
    }

    /**
     *
     * @param settings
     * @private
     */
    function _loadAnimationPlugins(settings) {

        Object.assign(HC.plugins.pattern_overlay, HC.plugins.pattern);

        let sectionKeys = Object.keys(HC.plugins);

        for (let pi = 0; pi < sectionKeys.length; pi++) {

            let section = sectionKeys[pi];

            // create plugin namespaces to work in
            HC.Shape.prototype.injected.plugins[section] = {};

            _loadPlugins(settings, section, HC.plugins[section]);

        }
    }

    /**
     *
     * @param settings
     * @private
     */
    function _loadRhythms(settings) {
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
    function _loadShaderSettings(values) {
        let settings = {};
        let keys = Object.keys(values);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let plug = HC.plugins.shaders[key];
            settings[key] = plug.settings || {};
        }

        return settings;
    }
}
