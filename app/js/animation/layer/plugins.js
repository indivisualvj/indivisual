HC.Layer.prototype.getPlugin = function (plugin, name) {

    if (DEBUG) {
        if (!(plugin in this.plugins)) {
            throw 'plugin not found: ' + plugin;
        }
        if (!(plugin in this.settings)) {
            throw 'setting not found: ' + plugin;
        }
        name = name || this.settings[plugin];
        if (!(name in this.plugins[plugin])) {
            throw 'plugin not found: ' + plugin + '.' + name;
        }
    }

    return this.plugins[plugin][name] || false;
};

/**
 *
 * @param name
 * @returns {*}
 */
HC.Layer.prototype.getLightingLookatPlugin = function (name) {
    return this.getPlugin('lighting_lookat', name);
};

/**
 *
 * @param name
 * @returns {*}
 */
HC.Layer.prototype.getLightingPatternPlugin = function (name) {
    return this.getPlugin('lighting_pattern', name);
};

/**
 *
 * @param name
 * @returns {*}
 */
HC.Layer.prototype.getLightingTypePlugin = function (name) {
    return this.getPlugin('lighting_type', name);
};

/**
 *
 * @param name
 * @returns {*}
 */
HC.Layer.prototype.getShaderPlugin = function (name) {
    return this.getPlugin('shaders', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getPatternRotationPlugin = function (name) {
    return this.getPlugin('pattern_rotation', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getShapeLookatPlugin = function (name) {
    return this.getPlugin('shape_lookat', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getBackgroundModePlugin = function (name) {
    return this.getPlugin('background_mode', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getOffsetModePlugin = function (name) {
    return this.getPlugin('offset_mode', name);
};

/**
 *
 * @param name
 * @returns {*|string|boolean}
 */
HC.Layer.prototype.getPatternPlugin = function (name) {
    return this.getPlugin('pattern', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getPatternOverlayPlugin = function (name) {
    return this.getPlugin('pattern_overlay', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getRotationOffsetModePlugin = function (name) {
    return this.getPlugin('rotation_offset_mode', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getRotationModePlugin = function (name) {
    return this.getPlugin('rotation_mode', name || 'default');
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getRotationDirectionPlugin = function (name) {
    return this.getPlugin('rotation_direction', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getPatternMoverPlugin = function (name) {
    return this.getPlugin('pattern_mover', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getSizingModePlugin = function (name) {
    return this.getPlugin('sizing_mode', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getSizingFlipPlugin = function (name) {
    return this.getPlugin('sizing_flip', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getShapeGeometryPlugin = function (name) {
    return this.getPlugin('shape_geometry', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getShapeTransformPlugin = function (name) {
    return this.getPlugin('shape_transform', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getShapeModifierPlugin = function (name) {
    return this.getPlugin('shape_modifier', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getShapeRhythmPlugin = function (name) {
    return this.getPlugin('shape_rhythm', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getShapeDelayPlugin = function (name) {
    return this.getPlugin('shape_delay', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getShapePairingPlugin = function (name) {
    return this.getPlugin('shape_pairing', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getOscillatePlugin = function (name) {
    return this.getPlugin('oscillate', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getColoringModePlugin = function (name) {
    return this.getPlugin('coloring_mode', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getFilterModePlugin = function (name) {
    return this.getPlugin('filter_mode', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getMaterialMeshPlugin = function (name) {
    return this.getPlugin('mesh_material', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getMaterialStylePlugin = function (name) {
    return this.getPlugin('material_style', name);
};

/**
 *
 * @param name
 * @returns {*|boolean}
 */
HC.Layer.prototype.getCameraModePlugin = function (name) {
    return this.getPlugin('camera_mode', name);
};

/**
 *
 * @param plugin
 * @param shape
 * @returns {*}
 */
HC.Layer.prototype.getShapePluginParams = function (plugin, shape) {
    return this.getPlugin(plugin).params(shape);
};

/**
 *
 * @param shape
 * @returns {*}
 */
HC.Layer.prototype.getShapeDuration = function (shape) {
    return this.getShapePluginParams('shape_rhythm', shape).duration;
};

/**
 *
 * @param shape
 * @returns {*}
 */
HC.Layer.prototype.getShapeDirection = function (shape) {
    return this.getShapePluginParams('rotation_direction', shape).dir;
};

/**
 *
 */
HC.Layer.prototype.resetPlugins =  function () {

    var pluginKeys = Object.keys(HC.plugins);

    for (var pi = 0; pi < pluginKeys.length; pi++) {

        var plugin = pluginKeys[pi];
        var items  = HC.plugins[plugin];

        this.plugins[plugin] = this.plugins[plugin] || {};

        var keys = Object.keys(items);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];

            if (plugin in this.plugins && key in this.plugins[plugin]) {
                var plug = this.getPlugin(plugin, key);
                if (plug instanceof HC.ShaderPlugin) {
                    // no reset of ShaderPlugins
                    continue;
                }
                if (plug.dispose) {
                    // this was created for ShaderPlugins, but no good disposing these...
                    plug.dispose();
                }
            }
            var instance = this.loadPlugin(plugin, key);
            instance.construct(this, this.settings, plugin, key);
            instance.inject();
            this.setPlugin(plugin, key, instance);
        }
    }
};

/**
 *
 * @param plugin
 * @param name
 */
HC.Layer.prototype.loadPlugin =  function (plugin, name) {
    return new HC.plugins[plugin][name](this);
};

/**
 *
 * @param plugin
 * @param name
 * @param instance
 */
HC.Layer.prototype.setPlugin =  function (plugin, name, instance) {
    this.plugins[plugin][name] = instance;
};
