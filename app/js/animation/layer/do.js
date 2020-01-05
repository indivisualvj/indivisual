/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
/**
 *
 * @param shape
 */
HC.Layer.prototype.doPattern = function (shape) {
    var mover = this.getPatternMoverPlugin();
    if (mover && mover.before) {
        mover.before(shape);
    }

    var pattern = this.getPatternPlugin();
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

    var plugin = this.getRotationOffsetModePlugin();
    this.doPlugin(plugin, shape);

};

/**
 *
 * @param shape
 */
HC.Layer.prototype.doPairing = function (shape) {
    var plugin = this.getShapePairingPlugin();
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

        var nu = false;
        var index = shape.index;

        if (this.shapeCache
            && this.shapeCache.length
            && this.settings.pattern_overlay in this.shapeCache[index]
        ) {
            nu = this.shapeCache[index][this.settings.pattern_overlay];

        } else {
            nu = this.nextShape(index, true);

            var speed = this.getShapeRhythmPlugin();
            var delay = this.getShapeDelayPlugin();
            var direction = this.getRotationDirectionPlugin();
            speed.params(nu, speed.params(shape));
            delay.params(nu, delay.params(shape));
            direction.params(nu, direction.params(shape));

            if (this.shapeCache
                && this.shapeCache.length
            ) {
                this.shapeCache[index][this.settings.pattern_overlay] = nu;
            }
        }

        var plugin = this.getPatternOverlayPlugin();
        this.doPlugin(plugin, nu);

        if (this.settings.pattern_overlay_volume != 1) {
            var fade = ((2 * Math.abs(this.settings.pattern_overlay_volume)) - 1);

            var dx = (nu.x() - shape.x()) / 2;
            var dy = (nu.y() - shape.y()) / 2;
            var dz = (nu.z() - shape.z()) / 2;

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

    var seq = statics.SourceSettings.material_map;
    var map = this.settings.material_input;
    var color = false;

    if (seq !== 'none') {
        var plugin = this.getMaterialMapPlugin('sequence');
        // color = plugin.apply(parseInt(seq));
        color = this.doPlugin(plugin, parseInt(seq));

    } else {
        var plugin = this.getMaterialMapPlugin('texture');
        color = this.doPlugin(plugin, map);
    }

    return color;
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.doColoring = function (shape) {

    var proceed = true;
    var filter = this.getFilterModePlugin();
    if (filter && filter.before) {
        proceed = filter.before(shape);
    }

    if (proceed !== false) {
        var coloring = this.getColoringModePlugin();
        proceed = this.doPlugin(coloring, shape);

        if (proceed !== false && filter && filter.apply) {
            proceed = filter.apply(shape);
            if (proceed !== false && filter.after) {
                filter.after(shape);
            }
        }
    }
    var color = shape.color;
    shape.opacity(color.o * this.settings.coloring_opacity);

    return proceed;
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.doMaterial = function (shape) {

    var style = this.getMaterialStylePlugin();
    this.doPlugin(style, shape);

    shape.strokeWidth(this.settings.material_volume);

    try {
        var map = this.getMaterialMap();
        shape.updateMaterial(map, this.settings.coloring_emissive);

    } catch (e) {
        console.error(e);
    }
};

/**
 *
 */
HC.Layer.prototype.doBackground = function () {
    var plugin = this.getBackgroundModePlugin();
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

    var roto = this.shape.rotation();
    var plugin = this.getPatternRotationPlugin();
    if (plugin.shared && plugin.shared.locking.disabled) {
        roto = plugin.getShapeEuler(shape);
    }

    var eu = {x: 0, y: 0, z: 0};

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
    var plugin = this.getShapeLookatPlugin();
    this.doPlugin(plugin, shape);
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.doSizing = function (shape) {

    var sizing = this.getSizingModePlugin();
    this.doPlugin(sizing, shape);

    var flip = this.getSizingFlipPlugin();
    this.doPlugin(flip, shape);

};

/**
 *
 * @param enable
 */
HC.Layer.prototype.doOscillate = function (enable) {
    let oscillator = HC.LayeredControlSetsManager.getAllOsciProperties();
    for (var i = 0; i < oscillator.length; i++) {
        var key = oscillator[i];
        var okey = key + '_oscillate';
        if (this.settings[okey] !== undefined) {
            var osci = this.settings[okey];
            if (osci in HC.plugins.oscillate) {
                var plugin = this.getOscillatePlugin(osci);
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

    var plugin = this.getShapeTransformPlugin();
    this.doPlugin(plugin, shape);
};

/**
 *
 */
HC.Layer.prototype.doShaders = function () {

    var shaders = this.shaders();
    if (shaders) {
        var last;
        for (var i = 0; i < shaders.length; i++) {
            var plugin = shaders[i];
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

    var plugin = this.getOffsetModePlugin();
    this.doPlugin(plugin, shape);
};

/**
 *
 * @param plugin
 * @param params
 * @returns {*}
 */
HC.Layer.prototype.doPlugin = function (plugin, params) {

    var result = true;
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
    var plugin = this.getCameraModePlugin();
    this.doPlugin(plugin);

    listener.fireEvent('layer.doCameraMode', this.getCamera());
};

/**
 *
 */
HC.Layer.prototype.doPatternRotation = function () {
    var plugin = this.getPatternRotationPlugin();
    this.doPlugin(plugin);
};

