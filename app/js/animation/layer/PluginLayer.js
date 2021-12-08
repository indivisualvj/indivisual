/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {_Layer} from "./NextLayer";

class Layer extends _Layer {


    /**
     *
     * @param plugin
     * @param name
     * @returns {HC.AnimationPlugin}
     */
    getPlugin(plugin, name) {

        name = name || this.settings[plugin]; // specific plugin OR value from corresponding setting

        return this.plugins[plugin][name];// || false;
    };

    /**
     *
     * @param name
     * @returns {HC.OverrideMaterialInputPlugin}
     */
    getOverrideMaterialInputPlugin(name) {
        return this.getPlugin('override_material_input', name);
    };

    /**
     *
     * @param name
     * @returns {HC.OverrideMaterialInputPlugin}
     */
    getOverrideBackgroundModePlugin(name) {
        return this.getPlugin('override_background_mode', name);
    };


    /**
     *
     * @param name
     * @returns {LightingLookatPlugin}
     */
    getLightingLookatPlugin(name) {
        return this.getPlugin('lighting_lookat', name);
    };

    /**
     *
     * @param name
     * @returns {LightingPatternPlugin}
     */
    getLightingPatternPlugin(name) {
        return this.getPlugin('lighting_pattern', name);
    };

    /**
     *
     * @param name
     * @returns {LightingTypePlugin}
     */
    getLightingTypePlugin(name) {
        return this.getPlugin('lighting_type', name);
    };

    /**
     *
     * @param name
     * @returns {HC.ShaderPlugin}
     */
    getShaderPlugin(name) {
        return this.getPlugin('shaders', name);
    };

    /**
     *
     * @param name
     * @param key
     * @param properties
     * @returns {HC.ShaderPlugin}
     */
    getShaderPassPlugin(name, key, properties) {

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
     * @returns {PatternRotationPlugin}
     */
    getPatternRotationPlugin(name) {
        return this.getPlugin('pattern_rotation', name);
    };

    /**
     *
     * @param name
     * @returns {ShapeLookatPlugin}
     */
    getShapeLookatPlugin(name) {
        return this.getPlugin('shape_lookat', name);
    };

    /**
     *
     * @param name
     * @returns {HC.BackgroundModePlugin}
     */
    getBackgroundModePlugin(name) {
        return this.getPlugin('background_mode', name);
    };

    /**
     *
     * @param name
     * @returns {OffsetModePlugin}
     */
    getOffsetModePlugin(name) {
        return this.getPlugin('offset_mode', name);
    };

    /**
     *
     * @param name
     * @returns {HC.PatternPlugin}
     */
    getPatternPlugin(name) {
        return this.getPlugin('pattern', name);
    };

    /**
     *
     * @param name
     * @returns {HC.PatternPlugin}
     */
    getPatternOverlayPlugin(name) {
        return this.getPlugin('pattern_overlay', name);
    };

    /**
     *
     * @param name
     * @returns {HC.RotationOffsetModePlugin}
     */
    getRotationOffsetModePlugin(name) {
        return this.getPlugin('rotation_offset_mode', name);
    };

    /**
     *
     * @param name
     * @returns {RotationModePlugin}
     */
    getRotationModePlugin(name) {
        return this.getPlugin('rotation_mode', name);
    };

    /**
     *
     * @param name
     * @returns {RotationDirectionPlugin}
     */
    getRotationDirectionPlugin(name) {
        return this.getPlugin('rotation_direction', name);
    };

    /**
     *
     * @param name
     * @returns {HC.PatternMoverPlugin}
     */
    getPatternMoverPlugin(name) {
        return this.getPlugin('pattern_mover', name);
    };

    /**
     *
     * @param name
     * @returns {SizingModePlugin}
     */
    getSizingModePlugin(name) {
        return this.getPlugin('sizing_mode', name);
    };

    /**
     *
     * @param name
     * @returns {SizingFlipPlugin}
     */
    getSizingFlipPlugin(name) {
        return this.getPlugin('sizing_flip', name);
    };

    /**
     *
     * @param name
     * @returns {HC.ShapeGeometryPlugin}
     */
    getShapeGeometryPlugin(name) {
        return this.getPlugin('shape_geometry', name);
    };

    /**
     *
     * @param name
     * @returns {ShapeTransformPlugin}
     */
    getShapeTransformPlugin(name) {
        return this.getPlugin('shape_transform', name);
    };

    /**
     *
     * @param name
     * @returns {HC.ShapeModifierPlugin}
     */
    getShapeModifierPlugin(name) {
        return this.getPlugin('shape_modifier', name);
    };

    /**
     *
     * @param name
     * @returns {ShapeRhythmPlugin}
     */
    getShapeRhythmPlugin(name) {
        return this.getPlugin('shape_rhythm', name);
    };

    /**
     *
     * @param name
     * @returns {HC.ShapeDelayPlugin}
     */
    shapeDelayPlugin(name) {
        return this.getPlugin('shape_delay', name);
    };

    /**
     *
     * @param name
     * @returns {ShapePairingPlugin}
     */
    getShapePairingPlugin(name) {
        return this.getPlugin('shape_pairing', name);
    };

    /**
     *
     * @param name
     * @returns {HC.OscillatePlugin}
     */
    getOscillatePlugin(name) {
        return this.getPlugin('oscillate', name);
    };

    /**
     *
     * @param name
     * @returns {ColoringModePlugin}
     */
    getColoringModePlugin(name) {
        return this.getPlugin('coloring_mode', name);
    };

    /**
     *
     * @param name
     * @returns {FilterModePlugin}
     */
    getFilterModePlugin(name) {
        return this.getPlugin('filter_mode', name);
    };

    /**
     *
     * @param name
     * @returns {HC.MeshMaterialPlugin}
     */
    getMeshMaterialPlugin(name) {
        return this.getPlugin('mesh_material', name);
    };

    /**
     *
     * @param name
     * @returns {MaterialStylePlugin}
     */
    getMaterialStylePlugin(name) {
        return this.getPlugin('material_style', name);
    };

    /**
     *
     * @param name
     * @returns {CameraModePlugin}
     */
    getCameraModePlugin(name) {
        return this.getPlugin('camera_mode', name);
    };

    /**
     *
     * @param plugin
     * @param shape
     * @returns {*}
     */
    getShapePluginParams(plugin, shape) {
        return this.getPlugin(plugin).params(shape);
    };

    /**
     *
     * @param shape
     * @returns {*}
     */
    getShapeDuration(shape) {
        return this.getShapePluginParams('shape_rhythm', shape).duration;
    };

    /**
     *
     * @param shape
     * @returns {*}
     */
    getShapeDirection(shape) {
        return this.getShapePluginParams('rotation_direction', shape).dir;
    };

    /**
     *
     */
    resetPlugins() {
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
     * @protected
     */
    _reloadPlugins() {

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
    loadPlugin(plugin, name) {
        return new HC.plugins[plugin][name](this.animation, this);
    };

    /**
     *
     * @param plugin
     * @param name
     * @param instance
     */
    setPlugin(plugin, name, instance) {
        this.plugins[plugin][name] = instance;
    };

}

export {Layer as _Layer}
