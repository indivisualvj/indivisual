/**
 *
 * @returns {CanvasTexture}
 */
HC.Layer.prototype.getMaterialMap = function () {
    let seq = this.config.SourceSettings.material_map;
    if (seq !== 'none') {
        let plugin = this.getMaterialMapPlugin('sequence');

        return plugin;

    } else {
        let plugin = this.getMaterialMapPlugin('texture');

        return plugin;
    }
};

/**
 *
 * @param shape
 * @param x
 * @param y
 * @param z
 */
HC.Layer.prototype.positionIn3dSpace = function (shape, x, y, z) {
    let cp = new THREE.Vector3(x, y, z);
    let plugin = this.getPatternRotationPlugin();
    plugin.positionIn3dSpace(shape, cp);
};

/**
 *
 * @param shape
 * @param x
 * @param y
 * @param z
 */
HC.Layer.prototype.positionIn2dSpace = function (shape, x, y, z) {
    let cp = new THREE.Vector3(x, y, z);
    cp.add(this.patternCenterVector(true));
    shape.position().copy(cp);
};

/**
 *
 * @param x
 * @param y
 * @param z
 * @returns {*|HC.Shape.rotation|number|UniformsLib.sprite.rotation|{value}|rotation}
 */
HC.Layer.prototype.rotation = function (x, y, z) {
    if (x !== undefined) {

        x *= RAD;
        y *= -RAD;
        z *= -RAD;

        this._rotation.rotation.set(x, y, z);
    }

    return this._rotation.rotation;
};

/**
 *
 * @param x
 * @param y
 * @param z
 */
HC.Layer.prototype.position = function (x, y, z) {
    let cdd = this.cameraDefaultDistance(.25);
    this._rotation.position.set(this.resolution('half').x + x * cdd, -this.resolution('half').y - y * cdd, z * cdd);
};

/**
 *
 * @param sh
 * @param fx
 * @returns {*}
 */
HC.Layer.prototype.shaders = function (sh) {

    if (sh !== undefined) {
        let composer = this._composer;
        composer.passes = [composer.passes[0]];

        composer.reset();

        if (sh && sh.length) {
            let i = 0
            for (; i < sh.length; i++) {
                let pass = sh[i].create();
                composer.addPass(pass);
                pass.renderToScreen = false;
            }

            sh[i - 1].create().renderToScreen = true;
        }

        this._shaders = sh;

    } else {
        sh = this._shaders;
    }

    return sh;
};

/**
 *
 * @param depthMultiplier
 * @param reduce
 * @returns {Vector3}
 */
HC.Layer.prototype.random3dPosition = function (depthMultiplier, reduce) {
    return new THREE.Vector3(
        randomInt(0, this.resolution('half').x * this.settings.pattern_paddingx - (reduce || 0), true),
        randomInt(0, this.resolution('half').y * this.settings.pattern_paddingy - (reduce || 0), true),
        randomInt(0, this.cameraDefaultDistance(depthMultiplier || 0) * this.settings.pattern_paddingz, true)
    );
};

/**
 *
 * @param depthMultiplier
 * @param reduce
 * @returns {Vector3}
 */
HC.Layer.prototype.random2dPosition = function (depthMultiplier, reduce) {
    return new THREE.Vector3(
        randomInt(0, this.resolution().x),
        randomInt(0, -this.resolution().y),
        randomInt(0, this.cameraDefaultDistance(depthMultiplier || 0) * this.settings.pattern_paddingz, true)
    );
};

/**
 *
 * @returns {*|boolean}
 */
HC.Layer.prototype.getCurrentSpeed = function () {
    return this.beatKeeper.getSpeed(this.settings.rhythm);
};

/**
 *
 * @param shape
 * @returns {*}
 */
HC.Layer.prototype.getShapeSpeed = function (shape) {
    return this.getShapeRhythmPlugin().params(shape);
};

/**
 *
 * @param shape
 * @returns {*}
 */
HC.Layer.prototype.getShapeDelay = function (shape) {
    return this.getShapeDelayPlugin().params(shape);
};
