/**
 *
 * @param index
 * @param dummy
 * @returns {HC.Shape}
 */
HC.Layer.prototype.nextShape = function (index, dummy) {
    let mesh = dummy
        ? new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial())
        : this.nextMesh(index);

    let shape = new HC.Shape(mesh, index, randomColor());
    if (dummy) {
        shape.setVisible(false);
    }

    this.nextShapeDirection(shape);
    this.nextShapeRhythm(shape);
    // this.nextDelay(shape); // no delay for new shapes
    this.nextShapeRotation(shape);

    if (shape.isVisible()) {
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
    let modifier = this.getShapeModifierPlugin();
    return this.doPlugin(modifier, geometry);
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.nextShapeDirection = function (shape) {
    let direction = this.getRotationDirectionPlugin();
    this.doPlugin(direction, shape);
};

/**
 *
 * @param index
 * @returns {THREE.Mesh}
 */
HC.Layer.prototype.nextMesh = function (index) {

    let geometry = this.nextGeometry();
    geometry = this.nextShapeModifier(geometry);

    if (geometry) {
        let plugin = this.getMeshMaterialPlugin();
        if (plugin) {
            if (plugin.before) {
                geometry = plugin.before(geometry);
            }

            let mesh = plugin.apply(geometry, index);

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
 * @returns {THREE.Geometry}
 */
HC.Layer.prototype.nextGeometry = function () {
    let plugin = this.getShapeGeometryPlugin();
    if (plugin && plugin.apply) {

        let geometry = plugin.apply();

        if (plugin.after) {
            plugin.after(geometry);
        }

        return geometry;

    }

    return new THREE.PlaneGeometry(this.shapeSize(.1), this.shapeSize(1));
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.nextShapeDelay = function (shape) {

    let delay = this.getShapeDelayPlugin();
    this.doPlugin(delay, shape);

};

/**
 *
 * @param shape
 */
HC.Layer.prototype.nextShapeRhythm = function (shape) {

    if (this.config.ControlSettings.beat) {
        let plugin = this.getShapeRhythmPlugin();
        this.doPlugin(plugin, shape);

    } else {
        let max = 200000 / this.config.ControlSettings.tempo;
        let min = max / 1.5;
        this.getShapeRhythmPlugin().params(shape).duration = randomInt(min, max);
    }
};

/**
 *
 * @param shape
 */
HC.Layer.prototype.nextShapeRotation = function (shape) {
    let rotation = this.getRotationModePlugin();
    this.doPlugin(rotation, shape);
};
