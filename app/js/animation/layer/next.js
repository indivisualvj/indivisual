/**
 *
 * @param index
 * @param dummy
 * @returns {HC.Shape}
 */
HC.Layer.prototype.nextShape = function (index, dummy) {
    var mesh = dummy
        ? new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial())
        : this.nextMesh(index);

    var shape = new HC.Shape(mesh, index, this.randomColor());
    shape.dummy = dummy;

    this.nextShapeDirection(shape);
    this.nextShapeRhythm(shape);
    // this.nextDelay(shape); // no delay for new shapes
    this.nextShapeRotation(shape);

    if (!shape.dummy) {
        // new shapes need coordinates for other plugins to use them especially pattern_mover
        this.doPlugin(this.getPatternPlugin(), shape);
    }

    return shape;
};

/**
 *
 * @param geometry
 */
HC.Layer.prototype.nextShapeModifier = function (geometry) {
    var modifier = this.getShapeModifierPlugin();
    return this.doPlugin(modifier, geometry);
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.nextShapeDirection = function (shape) {
    var direction = this.getRotationDirectionPlugin();
    this.doPlugin(direction, shape);
};

/**
 *
 * @param index
 * @returns {THREE.Mesh}
 */
HC.Layer.prototype.nextMesh = function (index) {

    var geometry = this.nextGeometry();
    geometry = this.nextShapeModifier(geometry);

    if (geometry) {
        var plugin = this.getMeshMaterialPlugin();
        if (plugin) {
            if (plugin.before) {
                geometry = plugin.before(geometry);
            }

            var mesh = plugin.apply(geometry, index);

            if (plugin.after) {
                plugin.after(mesh);
            }

            return mesh;
        }
    }

    return false;
};

/**
 *
 * @returns {*}
 */
HC.Layer.prototype.nextGeometry = function () {
    var plugin = this.getShapeGeometryPlugin();
    if (plugin && plugin.apply) {

        var geometry = plugin.apply();

        if (plugin.after) {
            plugin.after(geometry);
        }

        return geometry;
    }

    return false;
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.nextShapeDelay = function (shape) {

    var delay = this.getShapeDelayPlugin();
    this.doPlugin(delay, shape);

};

/**
 *
 * @param shape
 */
HC.Layer.prototype.nextShapeRhythm = function (shape) {

    if (statics.ControlSettings.beat) {
        var plugin = this.getShapeRhythmPlugin();
        this.doPlugin(plugin, shape);

    } else {
        var max = 200000 / statics.ControlSettings.tempo;
        var min = max / 1.5;
        this.getShapeRhythmPlugin().params(shape).duration = randomInt(min, max);
    }
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.nextShapeRotation = function (shape) {
    var rotation = this.getRotationModePlugin();
    this.doPlugin(rotation, shape);
};