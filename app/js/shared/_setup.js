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

LAYER_KEYCODES = {
    "49": 0,
    "50": 1,
    "51": 2,
    "52": 3,
    "53": 4,
    "54": 5,
    "55": 6,
    "56": 7,
    "57": 8,
    "48": 9,
    "97": 0,
    "98": 1,
    "99": 2,
    "100": 3,
    "101": 4,
    "102": 5,
    "103": 6,
    "104": 7,
    "105": 8,
    "96": 9
};

OSD_TIMEOUT = 2000;
RAD = Math.PI / 180;
DEG = 180 / Math.PI;
SQUARE_DIAMETER = (Math.sqrt(2 * 2 + 2 * 2) / 2);
ANTIALIAS = true;

var HC = HC || {};

HC.now = window.performance.now.bind(window.performance);
if (TWEEN) {
    TWEEN.now = HC.now;
}

var assetman = new HC.AssetManager();
var statics;

/**
 *
 * @param resources
 * @param callback
 */
function loadResources(resources, callback) {
    var _load = function (index, finished) {

        if (index > resources.length - 1) {
            finished();
            return;
        }
        var rsc = resources[index];
        var action = 'get';
        if (rsc.action) {
            action = rsc.action;
        }
        var file = filePath(rsc.base || APP_DIR, rsc.file);
        messaging._emit({action: action, file: file, name: rsc.name}, function (data) {
            rsc.callback(data, function () {
                _load(index + 1, finished);
            });
        });
    };

    var _setup = function (callback) {
        if (!(_HASH in statics.ControlValues.session)) {
            statics.ControlValues.session[_HASH] = _HASH;
        }

        statics.ControlSettings.session = _HASH;

        callback();
    };

    _load(0, function () {
        _setup(callback);
    });
}

/**
 * All setup operations are encapsulated into this function
 * @returns {*[]}
 */
function setupResources() {
    return [
        {
            file: 'structure/Statics.yml',
            callback: function (data, finished) {
                statics = new HC.Settings(jsyaml.load(data.contents));
                finished();
            }
        },
        {
            file: 'structure/ShaderValues.yml',
            callback: function (data, finished) {
                var settings = jsyaml.load(data.contents);
                statics.ShaderValues = new HC.Settings(settings);
                finished();
            }
        },
        {
            file: 'structure/ShaderTypes.yml',
            callback: function (data, finished) {
                statics.ShaderTypes = new HC.Settings(jsyaml.load(data.contents));
                finished();
            }
        },
        {
            file: 'structure/AnimationValues.yml',
            callback: function (data, finished) {
                var settings = jsyaml.load(data.contents);

                _loadAnimationPlugins(settings);
                statics.ShaderSettings = new HC.Settings(_loadShaderSettings(settings.shaders));
                statics.Passes = [];
                for (let sh in statics.ShaderSettings.initial) {
                    statics.Passes.push(sh);
                }
                _loadRhythms(settings);

                statics.AnimationValues = new HC.Settings(settings);
                finished();
            }
        },
        {
            file: 'structure/AnimationSettings.yml',
            callback: function (data, finished) {
                data = jsyaml.load(data.contents);
                data.shaders = statics.ShaderSettings;
                // console.log(data.shaders);
                statics.AnimationSettings = new HC.Settings(data);
                finished();
            }
        },
        // {
        //     file: 'structure/AnimationController.yml',
        //     callback: function (data, finished) {
        //         data = jsyaml.load(data.contents);
        //         statics.AnimationController = new HC.AnimationController(data, statics.AnimationSettings);
        //         finished();
        //     }
        // },
        {
            file: 'structure/AnimationTypes.yml',
            callback: function (data, finished) {
                statics.AnimationTypes = new HC.Settings(jsyaml.load(data.contents));
                finished();
            }
        },
        {
            file: 'structure/ControlValues.yml',
            callback: function (data, finished) {
                var settings = jsyaml.load(data.contents);

                _loadAudioPlugins(settings);
                _loadShufflePlugins(settings);
                _loadControlSets();

                statics.ControlValues = new HC.Settings(settings);
                finished();
            }
        },
        {
            file: 'structure/ControlSettings.yml',
            callback: function (data, finished) {
                statics.ControlSettings = new HC.Settings(jsyaml.load(data.contents));
                finished();
            }
        },
        {
            file: 'structure/ControlTypes.yml',
            callback: function (data, finished) {
                statics.ControlTypes = new HC.Settings(jsyaml.load(data.contents));
                finished();
            }
        },
        {
            file: 'structure/DisplayValues.yml',
            callback: function (data, finished) {
                statics.DisplayValues = new HC.Settings(jsyaml.load(data.contents));
                finished();
            }
        },
        {
            file: 'structure/DisplaySettings.yml',
            callback: function (data, finished) {
                statics.DisplaySettings = new HC.Settings(jsyaml.load(data.contents));
                finished();
            }
        },
        {
            file: 'structure/DisplayTypes.yml',
            callback: function (data, finished) {
                statics.DisplayTypes = new HC.Settings(jsyaml.load(data.contents));
                finished();
            }
        },
        {
            file: 'structure/SourceValues.yml',
            callback: function (data, finished) {
                statics.SourceValues = new HC.Settings(jsyaml.load(data.contents));
                finished();
            }
        },
        {
            file: 'structure/SourceSettings.yml',
            callback: function (data, finished) {
                statics.SourceSettings = new HC.Settings(jsyaml.load(data.contents));
                finished();
            }
        },
        {
            file: 'structure/SourceTypes.yml',
            callback: function (data, finished) {
                statics.SourceTypes = new HC.Settings(jsyaml.load(data.contents));
                finished();
            }
        },
        {
            file: 'structure/DataSettings.yml',
            callback: function (data, finished) {
                statics.DataSettings = new HC.Settings(jsyaml.load(data.contents));
                finished();
            }
        },
        {
            file: 'structure/SourceTypes.yml',
            callback: function (data, finished) {
                statics.DataTypes = new HC.Settings(jsyaml.load(data.contents));
                finished();
            }
        },
        {
            file: 'structure/MidiController.yml',
            callback: function (data, finished) {

                var settings = jsyaml.load(data.contents);

                // create MIDI_ constants
                var constants = settings.Default.constants;
                for (var c in constants) {
                    var co = constants[c];
                    window[c] = co;
                }

                statics.MidiController = new HC.Settings(settings);
                finished();
            }
        },
        {
            action: 'files',
            base: '.',
            file: SESSION_DIR,
            callback: function (files, finished) {
                for (var i = 0; i < files.length; i++) {
                    var f = files[i];
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

                var videos = assetman.addVideos(files, 'name');

                // add videos into source values by index
                var keys = Object.keys(statics.SourceValues.input);
                var index = keys.length;
                for (var i in videos) {
                    statics.SourceValues.input[index++] = i;
                }

                finished();
            }
        },
        {
            action: 'files',
            base: '.',
            file: IMAGE_DIR,
            callback: function (files, finished) {
                var images = assetman.addImages(files, 'name');
                // add images into AnimationValues by name
                for (var i in images) {
                    statics.AnimationValues.material_input[i] = i;
                    statics.AnimationValues.background_input[i] = i;
                }

                // add images into source values by index
                var keys = Object.keys(statics.SourceValues.input);
                var index = keys.length;
                for (var i in images) {
                    if (!i.match(/^.+\.mat$/)) {
                        statics.SourceValues.input[index++] = i;
                    }
                }

                finished();
            }
        },
        {
            action: 'files',
            base: '.',
            file: CUBE_DIR,
            callback: function (files, finished) {
                var cubes = assetman.addCubes(files, 'name');
                // add cubes into AnimationValues by name
                for (var i in cubes) {
                    var name = i + '.cube';
                    statics.AnimationValues.background_input[i] = name;
                }

                finished();
            }
        }
    ];

    /**
     *
     * @param settings
     * @param tree
     * @param section
     * @param plugins
     * @private
     */
    function _loadPlugins(settings, tree, section, plugins) {

        var pluginKeys = Object.keys(plugins);

        pluginKeys.sort(function (a, b) {

            var ai = plugins[a].index || 99999;
            var bi = plugins[b].index || 99999;
            var an = plugins[a].name || a;
            var bn = plugins[b].name || b;

            if (an === 'Plugin') {
                an = a;
            }
            if (bn === 'Plugin') {
                bn = b;
            }

            var cmpi = ai - bi;
            if (cmpi == 0) {
                return an.localeCompare(bn);
            }
            return cmpi;
        });

        for (var i = 0; i < pluginKeys.length; i++) {

            var pluginKey = pluginKeys[i];
            var plugin = tree[section][pluginKey];
            var name = plugin.name || pluginKey;

            if (name == 'Plugin') {
                name = pluginKey;
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
        _loadPlugins(settings, HC, 'audio', HC.audio);
    }

    /**
     *
     * @param settings
     * @private
     */
    function _loadShufflePlugins(settings) {
        _loadPlugins(settings, HC, 'shuffle_mode', HC.shuffle_mode);
    }

    /**
     *
     * @param settings
     * @private
     */
    function _loadAnimationPlugins(settings) {

        Object.assign(HC.plugins.pattern_overlay, HC.plugins.pattern);

        var sectionKeys = Object.keys(HC.plugins);

        for (var pi = 0; pi < sectionKeys.length; pi++) {

            var section = sectionKeys[pi];

            // create plugin namespaces to work in
            HC.Shape.prototype.injected.plugins[section] = {};

            _loadPlugins(settings, HC.plugins, section, HC.plugins[section]);

        }

        statics.ShaderValues.oscillate = settings.oscillate;
    }

    /**
     *
     * @param settings
     * @private
     */
    function _loadRhythms(settings) {
        var speeds = HC.Beatkeeper.prototype.speeds;
        for (var key in speeds) {
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
        var settings = {};
        var keys = Object.keys(values);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var plug = HC.plugins.shaders[key];
            settings[key] = plug.settings || {};
        }

        return settings;
    }
}