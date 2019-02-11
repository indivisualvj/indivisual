/**
 *
 * @returns {number}
 */
HC.Layer.prototype.patternCenterX = function () {
    return this.resolution('half').x + this.cameraDefaultDistance(.25) * this.settings.pattern_centerx; // todo globally use diameterv.length() instead of width/height
};

/**
 *
 * @returns {number}
 */
HC.Layer.prototype.patternCenterY = function () {
    return this.resolution('half').y + this.cameraDefaultDistance(.25) * this.settings.pattern_centery;
};

/**
 *
 * @returns {number}
 */
HC.Layer.prototype.patternCenterZ = function () {
    return this.cameraDefaultDistance(.25) * this.settings.pattern_centerz;
};

/**
 *
 * @param invertY
 * @returns {Vector3}
 */
HC.Layer.prototype.patternCenterVector = function (invertY) {
    return new THREE.Vector3(this.patternCenterX(), this.patternCenterY()*(invertY?-1:1), this.patternCenterZ());
};
