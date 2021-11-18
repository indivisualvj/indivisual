/**
 *
 * @param plugin
 * @param name
 * @returns {HC.AnimationPlugin}
 */
HC.Layer.prototype.getPlugin = function (plugin, name) {

    name = name || this.settings[plugin]; // specific plugin OR value from corresponding setting

    return this.plugins[plugin][name];// || false;
};

/**
 *
 * @param name
 * @returns {HC.MaterialMapPlugin}
 */
HC.Layer.prototype.getMaterialMapPlugin = function (name) {
    return this.getPlugin('material_map', name);
};

/**
 *
 * @param name
 * @returns {HC.MaterialMapPlugin}
 */
HC.Layer.prototype.getBackgroundMapPlugin = function (name) {
    return this.getPlugin('background_map', name);
};


/**
 *
 * @param name
 * @returns {HC.LightingLookatPlugin}
 */
HC.Layer.prototype.getLightingLookatPlugin = function (name) {
    return this.getPlugin('lighting_lookat', name);
};

/**
 *
 * @param name
 * @returns {HC.LightingPatternPlugin}
 */
HC.Layer.prototype.getLightingPatternPlugin = function (name) {
    return this.getPlugin('lighting_pattern', name);
};

/**
 *
 * @param name
 * @returns {HC.LightingTypePlugin}
 */
HC.Layer.prototype.getLightingTypePlugin = function (name) {
    return this.getPlugin('lighting_type', name);
};

/**
 *
 * @param name
 * @returns {HC.ShaderPlugin}
 */
HC.Layer.prototype.getShaderPlugin = function (name) {
    return this.getPlugin('shaders', name);
};

/**
 *
 * @param name
 * @param key
 * @param properties
 * @returns {HC.ShaderPlugin}
 */
HC.Layer.prototype.getShaderPassPlugin = function (name, key, properties) {

    if (!('passes' in this.plugins)) {
        this.plugins['passes'] = {};
    }

    let plugin = this.getPlugin('passes', key, true);
    if (!plugin) {
        plugin = this.loadPlugin('shaders', name);
        this.setPlugin('passes', key, plugin);
    }

    let settings = {shaders: {}};
    settings.shaders[key] = properties;

    plugin.construct(this.animation, this, settings, 'shaders', key);

    return plugin;
};


/**
 *
 * @param name
 * @returns {HC.PatternRotationPlugin}
 */
HC.Layer.prototype.getPatternRotationPlugin = function (name) {
    return this.getPlugin('pattern_rotation', name);
};

/**
 *
 * @param name
 * @returns {HC.ShapeLookatPlugin}
 */
HC.Layer.prototype.getShapeLookatPlugin = function (name) {
    return this.getPlugin('shape_lookat', name);
};

/**
 *
 * @param name
 * @returns {HC.BackgroundModePlugin}
 */
HC.Layer.prototype.getBackgroundModePlugin = function (name) {
    return this.getPlugin('background_mode', name);
};

/**
 *
 * @param name
 * @returns {HC.OffsetModePlugin}
 */
HC.Layer.prototype.getOffsetModePlugin = function (name) {
    return this.getPlugin('offset_mode', name);
};

/**
 *
 * @param name
 * @returns {HC.PatternPlugin}
 */
HC.Layer.prototype.getPatternPlugin = function (name) {
    return this.getPlugin('pattern', name);
};

/**
 *
 * @param name
 * @returns {HC.PatternPlugin}
 */
HC.Layer.prototype.getPatternOverlayPlugin = function (name) {
    return this.getPlugin('pattern_overlay', name);
};

/**
 *
 * @param name
 * @returns {HC.RotationOffsetModePlugin}
 */
HC.Layer.prototype.getRotationOffsetModePlugin = function (name) {
    return this.getPlugin('rotation_offset_mode', name);
};

/**
 *
 * @param name
 * @returns {HC.RotationModePlugin}
 */
HC.Layer.prototype.getRotationModePlugin = function (name) {
    return this.getPlugin('rotation_mode', name);
};

/**
 *
 * @param name
 * @returns {HC.RotationDirectionPlugin}
 */
HC.Layer.prototype.getRotationDirectionPlugin = function (name) {
    return this.getPlugin('rotation_direction', name);
};

/**
 *
 * @param name
 * @returns {HC.PatternMoverPlugin}
 */
HC.Layer.prototype.getPatternMoverPlugin = function (name) {
    return this.getPlugin('pattern_mover', name);
};

/**
 *
 * @param name
 * @returns {HC.SizingModePlugin}
 */
HC.Layer.prototype.getSizingModePlugin = function (name) {
    return this.getPlugin('sizing_mode', name);
};

/**
 *
 * @param name
 * @returns {HC.SizingFlipPlugin}
 */
HC.Layer.prototype.getSizingFlipPlugin = function (name) {
    return this.getPlugin('sizing_flip', name);
};

/**
 *
 * @param name
 * @returns {HC.ShapeGeometryPlugin}
 */
HC.Layer.prototype.getShapeGeometryPlugin = function (name) {
    return this.getPlugin('shape_geometry', name);
};

/**
 *
 * @param name
 * @returns {HC.ShapeTransformPlugin}
 */
HC.Layer.prototype.getShapeTransformPlugin = function (name) {
    return this.getPlugin('shape_transform', name);
};

/**
 *
 * @param name
 * @returns {HC.ShapeModifierPlugin}
 */
HC.Layer.prototype.getShapeModifierPlugin = function (name) {
    return this.getPlugin('shape_modifier', name);
};

/**
 *
 * @param name
 * @returns {HC.ShapeRhythmPlugin}
 */
HC.Layer.prototype.getShapeRhythmPlugin = function (name) {
    return this.getPlugin('shape_rhythm', name);
};

/**
 *
 * @param name
 * @returns {HC.ShapeDelayPlugin}
 */
HC.Layer.prototype.getShapeDelayPlugin = function (name) {
    return this.getPlugin('shape_delay', name);
};

/**
 *
 * @param name
 * @returns {HC.ShapePairingPlugin}
 */
HC.Layer.prototype.getShapePairingPlugin = function (name) {
    return this.getPlugin('shape_pairing', name);
};

/**
 *
 * @param name
 * @returns {HC.OscillatePlugin}
 */
HC.Layer.prototype.getOscillatePlugin = function (name) {
    return this.getPlugin('oscillate', name);
};

/**
 *
 * @param name
 * @returns {HC.ColoringModePlugin}
 */
HC.Layer.prototype.getColoringModePlugin = function (name) {
    return this.getPlugin('coloring_mode', name);
};

/**
 *
 * @param name
 * @returns {HC.FilterModePlugin}
 */
HC.Layer.prototype.getFilterModePlugin = function (name) {
    return this.getPlugin('filter_mode', name);
};

/**
 *
 * @param name
 * @returns {HC.MeshMaterialPlugin}
 */
HC.Layer.prototype.getMeshMaterialPlugin = function (name) {
    return this.getPlugin('mesh_material', name);
};

/**
 *
 * @param name
 * @returns {HC.MaterialStylePlugin}
 */
HC.Layer.prototype.getMaterialStylePlugin = function (name) {
    return this.getPlugin('material_style', name);
};

/**
 *
 * @param name
 * @returns {HC.CameraModePlugin}
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
HC.Layer.prototype.resetPlugins = function () {
    let pluginKeys = Object.keys(HC.plugins);

    for (let pi = 0; pi < pluginKeys.length; pi++) {

        let plugin = pluginKeys[pi];
        let items = HC.plugins[plugin];

        this.plugins[plugin] = this.plugins[plugin] || {};

        let keys = Object.keys(items);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];

            if (plugin in this.plugins && key in this.plugins[plugin]) {
                let plug = this.getPlugin(plugin, key);
                if (plug.reset) {
                    plug.reset();
                }
            }
        }
    }
};

/**
 *
 * @private
 */
HC.Layer.prototype._reloadPlugins = function () {

    let pluginKeys = Object.keys(HC.plugins);

    for (let pi = 0; pi < pluginKeys.length; pi++) {

        let plugin = pluginKeys[pi];
        let items = HC.plugins[plugin];

        this.plugins[plugin] = this.plugins[plugin] || {};

        let keys = Object.keys(items);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];

            if (plugin in this.plugins && key in this.plugins[plugin]) {
                let plug = this.getPlugin(plugin, key);

                if (plug.reset) {
                    plug.reset();
                }
            }
            let instance = this.loadPlugin(plugin, key);
            instance.construct(this.animation, this, this.settings, plugin, key);
            instance.setControlSets(this.controlSets);
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
HC.Layer.prototype.loadPlugin = function (plugin, name) {
    return new HC.plugins[plugin][name](this.animation, this);
};

/**
 *
 * @param plugin
 * @param name
 * @param instance
 */
HC.Layer.prototype.setPlugin = function (plugin, name, instance) {
    this.plugins[plugin][name] = instance;
};
