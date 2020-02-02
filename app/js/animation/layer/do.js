/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
/**
 *
 * @param shape
 */
HC.Layer.prototype.doPattern = function (shape) {
    let mover = this.getPatternMoverPlugin();
    if (mover && mover.before) {
        mover.before(shape);
    }

    let pattern = this.getPatternPlugin();
    this.doPlugin(pattern, shape);

    if (mover) {
        mover.apply(shape);
    }

    this.doOverlay(shape);
    this.doPairing(shape);

};

/**
 *
 * @param shape
 * @param v
 * @returns {number}
 */
HC.Layer.prototype.doRotationOffset = function (shape) {

    let plugin = this.getRotationOffsetModePlugin();
    this.doPlugin(plugin, shape);

};

/**
 *
 * @param shape
 */
HC.Layer.prototype.doPairing = function (shape) {
    let plugin = this.getShapePairingPlugin();
    this.doPlugin(plugin, shape);
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.doOverlay = function (shape) {

    if (!shape.isVisible()) {
        return;
    }

    if (this.settings.pattern_overlay != 'off'
        && this.settings.pattern_overlay_volume != 0
    ) {

        let nu = false;
        let index = shape.index;

        if (this.shapeCache
            && this.shapeCache.length
            && this.settings.pattern_overlay in this.shapeCache[index]
        ) {
            nu = this.shapeCache[index][this.settings.pattern_overlay];

        } else {
            nu = this.nextShape(index, true);

            let speed = this.getShapeRhythmPlugin();
            let delay = this.getShapeDelayPlugin();
            let direction = this.getRotationDirectionPlugin();
            speed.params(nu, speed.params(shape));
            delay.params(nu, delay.params(shape));
            direction.params(nu, direction.params(shape));

            if (this.shapeCache
                && this.shapeCache.length
            ) {
                this.shapeCache[index][this.settings.pattern_overlay] = nu;
            }
        }

        let plugin = this.getPatternOverlayPlugin();
        this.doPlugin(plugin, nu);

        if (this.settings.pattern_overlay_volume != 1) {
            let fade = ((2 * Math.abs(this.settings.pattern_overlay_volume)) - 1);

            let dx = (nu.x() - shape.x()) / 2;
            let dy = (nu.y() - shape.y()) / 2;
            let dz = (nu.z() - shape.z()) / 2;

            dx += dx * fade;
            dy += dy * fade;
            dz += dz * fade;

            shape.move(dx, dy, dz);

        } else {
            shape.x(nu.x());
            shape.y(nu.y());
            shape.z(nu.z());
        }
    }
};

/**
 *
 * @returns {*}
 */
HC.Layer.prototype.doMaterialMap = function () {

    let seq = this.config.SourceSettings.material_map;
    let map = this.settings.material_input;
    let color = false;

    if (seq !== 'none') {
        let plugin = this.getMaterialMapPlugin('sequence');
        // color = plugin.apply(parseInt(seq));
        color = this.doPlugin(plugin, parseInt(seq));

    } else {
        let plugin = this.getMaterialMapPlugin('texture');
        color = this.doPlugin(plugin, map);
    }

    return color;
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.doColoring = function (shape) {

    let proceed = true;
    let filter = this.getFilterModePlugin();
    if (filter && filter.before) {
        proceed = filter.before(shape);
    }

    if (proceed !== false) {
        let coloring = this.getColoringModePlugin();
        proceed = this.doPlugin(coloring, shape);

        if (proceed !== false && filter && filter.apply) {
            proceed = filter.apply(shape);
            if (proceed !== false && filter.after) {
                filter.after(shape);
            }
        }
    }
    let color = shape.color;
    shape.opacity(color.o * this.settings.coloring_opacity);

    return proceed;
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.doMaterial = function (shape) {

    let style = this.getMaterialStylePlugin();
    this.doPlugin(style, shape);

    shape.strokeWidth(this.settings.material_volume);

    try {
        let map = this.getMaterialMap();
        let needsUpdate = this.controlSets.material.material_needs_update;
        shape.updateMaterial(map, this.controlSets.coloring.coloring_emissive, needsUpdate);
        if (needsUpdate) {
            this.controlSets.material.material_needs_update = false;
        }

    } catch (e) {
        console.error(e);
    }
};

/**
 *
 */
HC.Layer.prototype.doBackground = function () {
    let plugin = this.getBackgroundModePlugin();
    this.doPlugin(plugin);
};

/**
 *
 * @param materialColor
 */
HC.Layer.prototype.doLighting = function (materialColor) {
    if (materialColor || this.settings.lighting_color == '') {
        this.lightColor(materialColor || this.shapeColor(false));
    }
    this.updateLighting();
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.doLockingShapeRotation = function (shape) {

    let roto = this.shape.rotation();
    let plugin = this.getPatternRotationPlugin();
    if (plugin.shared && plugin.shared.locking.disabled) {
        roto = plugin.getShapeEuler(shape);
    }

    let eu = {x: 0, y: 0, z: 0};

    if (this.settings.locking_shapex) {
        eu.x = roto.x * this.settings.locking_shapex_multiplier;
        shape.rotation().x = eu.x;
    }

    if (this.settings.locking_shapey) {
        eu.y = roto.y * this.settings.locking_shapey_multiplier;
        shape.rotation().y = eu.y;
    }

    if (this.settings.locking_shapez) {
        eu.z = roto.z * this.settings.locking_shapez_multiplier;
        shape.rotation().z = eu.z;
    }

};

/**
 *
 * @param shape
 */
HC.Layer.prototype.doShapeLookat = function (shape) {
    let plugin = this.getShapeLookatPlugin();
    this.doPlugin(plugin, shape);
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.doSizing = function (shape) {

    let sizing = this.getSizingModePlugin();
    this.doPlugin(sizing, shape);

    let flip = this.getSizingFlipPlugin();
    this.doPlugin(flip, shape);

};

/**
 *
 * @param enable
 */
HC.Layer.prototype.doOscillate = function (enable) {
    let oscillator = HC.LayeredControlSetsManager.getAllOsciProperties();
    for (let i = 0; i < oscillator.length; i++) {
        let key = oscillator[i];
        let okey = key + '_oscillate';
        if (this.settings[okey] !== undefined) {
            let osci = this.settings[okey];
            if (osci in HC.plugins.oscillate) {
                let plugin = this.getOscillatePlugin(osci);
                if (plugin && plugin.apply) {
                    if (enable) {
                        plugin.store(key);
                        plugin.apply(key);

                    } else {
                        plugin.restore(key);
                    }
                }
            }
        }
    }
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.doShapeTransform = function (shape) {

    let plugin = this.getShapeTransformPlugin();
    this.doPlugin(plugin, shape);
};

/**
 *
 */
HC.Layer.prototype.doShaders = function () {

    let shaders = this.shaders();
    if (shaders) {
        let last;
        for (let i = 0; i < shaders.length; i++) {
            let plugin = shaders[i];
            if (plugin.apply(false, false)) {
                last = plugin;
            }
            plugin.pass.renderToScreen = false;
        }

        if (last) {
            this._composer.passes[0].renderToScreen = false;
            last.pass.renderToScreen = true;
        } else {
            this._composer.passes[0].renderToScreen = true;
        }
    }
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.doOffsetMode = function (shape) {

    let plugin = this.getOffsetModePlugin();
    this.doPlugin(plugin, shape);
};

/**
 *
 * @param plugin
 * @param params
 * @returns {*}
 */
HC.Layer.prototype.doPlugin = function (plugin, params) {

    let result = true;
    if (plugin && plugin.apply) {
        if (plugin.before) {
            if (params) {
                result = plugin.before(params);
            } else {
                result = plugin.before();
            }
        }

        if (result === false) {
            return false;
        }
        if (params !== undefined) {
            result = plugin.apply(params);

        } else {
            result = plugin.apply();
        }

        if (result === false) {
            return false;
        }

        if (plugin.after) {
            if (params) {
                plugin.after(params);

            } else {
                plugin.after();
            }
        }
    }

    return result;
};

/**
 *
 */
HC.Layer.prototype.doCameraMode = function () {
    let plugin = this.getCameraModePlugin();
    this.doPlugin(plugin);

    this.renderer.listener.fireEvent('layer.doCameraMode', this.getCamera());
};

/**
 *
 */
HC.Layer.prototype.doPatternRotation = function () {
    let plugin = this.getPatternRotationPlugin();
    this.doPlugin(plugin);
};

