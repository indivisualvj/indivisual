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

    if (shape.dummy) { return; }

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

    var map = statics.SourceSettings.material_map == 'none' ? this.settings.material_map : statics.SourceSettings.material_map;
    var mapped = false;
    var color = false;
    if (map !== 'none') {
        if (map.match(/^seq/)) {
            var i = number_extract(map, 'seq');
            var seq = sourceman.getSequence(i);
            var image = seq.current(renderer.current(), true);
            if (seq && image) {

                if (statics.shape_sequence != seq) {
                    var edge = Math.min(image.width, image.height);
                    var nearest = THREE.Math.floorPowerOfTwo(edge);
                    while (nearest > edge) {
                        nearest /= 2;
                        nearest = THREE.Math.floorPowerOfTwo(nearest);
                    }
                    edge = nearest;

                    var canvas = document.createElement('canvas');
                    canvas.id = seq.id + '_map';
                    canvas.width = edge;//image.width;
                    canvas.height = edge;//image.height;
                    canvas._ctx = canvas.getContext('2d');
                    canvas._clipX = (image.width - edge) / 2;
                    canvas._clipY = (image.height - edge) / 2;

                    var tex = new THREE.CanvasTexture(canvas);//, undefined, undefined, undefined, undefined, THREE.NearestFilter);
                    statics.material_map = tex;

                    statics.shape_sequence = seq;
                    statics.tmp.sample_map_size = canvas.width + 'x' + canvas.height;
                }
                var map = statics.material_map;
                var img = map.image;
                if (img) {
                    var width = map.image.width;
                    var height = map.image.height;
                    if (img._ctx) {
                        img._ctx.clearRect(0, 0, width, height);
                        img._ctx.drawImage(image, img._clipX, img._clipY, width, height, 0, 0, width, height);
                    }
                    img._color = image._color;
                    map.needsUpdate = true;
                    mapped = true;
                    color = image._color;
                }
            }

        } else if (map.match(/\.png$/)) {

            var name = this.settings.material_map;

            if (!statics.material_map || statics.material_map.name != name) {

                if (!statics.three.textures[name]) {

                    var loader = new THREE.TextureLoader();
                    var file = filePath('', ASSET_DIR, this.settings.material_map);
                    var texture = loader.load(file, function (tex) {
                        statics.material_map = tex;
                        statics.tmp.sample_map_size = tex.image.width;
                    });
                    texture.name = this.settings.material_map;
                    statics.three.textures[texture.name] = texture;

                } else if (statics.three.textures[name].image) {
                    statics.material_map = statics.three.textures[name];
                    mapped = true;
                }

            } else {
                mapped = true;
            }
        }
    }
    if (!mapped) {
        statics.tmp.sample_map_size = '';
        statics.material_map = false;
        statics.shape_sequence = false;
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
    shape.shininess(this.settings.material_shininess);

    return proceed;
};

HC.Layer.prototype.doMaterial = function (shape) {

    var style = this.getMaterialStylePlugin();
    this.doPlugin(style, shape);

    shape.strokeWidth(this.settings.material_volume);

    try {
        shape.updateMaterial(statics.material_map, this.settings.coloring_emissive);

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
    for (var i = 0; i < statics.oscillator.length; i++) {
        var key = statics.oscillator[i];
        var okey = key + '_oscillate';
        if (okey in this.settings) {
            var osci = this.settings[okey];
            if (osci in HC.plugins.oscillate && HC.plugins.oscillate[osci].executable !== false) {
                var plugin = this.getOscillatePlugin(osci);
                if (plugin && enable) {
                    plugin.store(key);
                    plugin.apply(key);

                } else if (plugin) {
                    plugin.restore(key);
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
 * @param shape
 * @returns {*}
 */
HC.Layer.prototype.doPlugin = function (plugin, shape) {

    var result = true;
    if (plugin && plugin.apply) {
        if (plugin.before) {
            if (shape) {
                result = plugin.before(shape);
            } else {
                result = plugin.before();
            }
        }

        if (result === false) {
            return false;
        }
        if (shape) {
            result = plugin.apply(shape);
        } else {
            result = plugin.apply();
        }

        if (result === false) {
            return false;
        }
        if (plugin.after) {
            if (shape) {
                plugin.after(shape);
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
};

/**
 *
 */
HC.Layer.prototype.doPatternRotation = function () {
    var plugin = this.getPatternRotationPlugin();
    this.doPlugin(plugin);
};

