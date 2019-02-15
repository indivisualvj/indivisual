/**
 *
 * @returns {{s: number, h: *, l: number, da: *, db: *, dc: *, o: number}}
 */
HC.Layer.prototype.randomColor = function () {
    var max = 360;
    var min = 0;
    var vh = randomInt(min, max);
    var vs = 10;
    var vl = 10;

    var no = randomFloat(0.5, 0.9, 2, false);

    max = 3;
    min = 1;
    var vdh = randomInt(min, max);
    var vds = randomInt(min, max);
    var vdl = randomInt(min, max);

    return {h: vh, s: vs, l: vl, da: vdh, db: vds, dc: vdl, o: no};
};

/**
 *
 * @returns {Vector3}
 */
HC.Layer.prototype.lookAtVector = function () {
    var v = this.cameraDefaultDistance();
    return new THREE.Vector3(
        v * this.settings.shape_lookat_centerx,
        v * this.settings.shape_lookat_centery,
        v * this.settings.shape_lookat_centerz
    );
};

/**
 *
 * @param shape
 * @param x
 * @param y
 * @param z
 */
HC.Layer.prototype.positionIn3dSpace = function (shape, x, y, z) {
    var cp = new THREE.Vector3(x, y, z);
    var plugin = this.getPatternRotationPlugin();
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
    var cp = new THREE.Vector3(x, y, z);
    cp.add(this.patternCenterVector(true));
    shape.position().copy(cp);
};

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
 * @param sh
 * @param fx
 * @returns {*}
 */
HC.Layer.prototype.shaders = function (sh) {

    if (sh !== undefined) {
        var composer = this._composer;
        composer.passes = [composer.passes[0]];

        composer.reset();

        if (sh && sh.length) {
            for (var i = 0; i < sh.length; i++) {
                var pass = sh[i].create();
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
    return beatkeeper.getSpeed(this.settings.rhythm);
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

/**
 *
 * @param value
 */
HC.Layer.prototype.setBackground = function (value) {
    if (value) {
        this.three.scene.background = value;

    } else {
        this.three.scene.background = null;
    }
};