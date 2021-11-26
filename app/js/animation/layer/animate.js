
/**
 *
 */
HC.Layer.prototype.animate = function () {

    this._handleResets();

    HC.EventManager.fireEvent(EVENT_LAYER_ANIMATE);

    this.updateTween();

    this.doOscillate(true);

    this.rotation(this.settings.layer_rotationx, this.settings.layer_rotationy, this.settings.layer_rotationz);
    this.position(this.settings.layer_positionx, this.settings.layer_positiony, this.settings.layer_positionz);

    this.doCameraMode();

    this.materialColor = this.doOverrideMaterialInput();

    this._animateShape(this.shape);
    this.doPatternRotation(); // preset current pattern euler from layer's shape rotation

    for (let i = 0; i < this.shapes.length; i++) {
        let shape = this.getShape(i);
        this._animateShape(shape, true);
        shape.materialNeedsUpdate = this.shapeMaterialsNeedUpdate;
    }

    this.shapeMaterialsNeedUpdate = false;

    this.doLighting(this.materialColor);
    this.doOverrideBackgroundMode();
    this.doBackground();

    this.doOscillate(false);
};

HC.Layer.prototype.updateTween = function () {
    this.tween.update(this.animation.now - this.lastUpdate, false);
};

/**
 *
 */
HC.Layer.prototype._handleResets = function () {
    if (this.needsReset) {
        console.log('layer.' + this.index, '_fullReset');
        this._fullReset();
    }
    if (this.shapesNeedReset) {
        console.log('layer.' + this.index, '_resetShapes');
        this._resetShapes();
    }
    if (this.shadersNeedUpdate) {
        console.log('layer.' + this.index, '_updateShaderPasses');
        this._updateShaderPasses();
    }
    if (this.lightingNeedsReset) {
        console.log('layer.' + this.index, '_resetLighting');
        this._resetLighting();
    }
    if (this.fogNeedsReset) {
        console.log('layer.' + this.index, '_resetFog');
        this._resetFog();
    }
    if (this.ambientNeedsReset) {
        console.log('layer.' + this.index, '_resetAmbientLight');
        this._resetAmbientLight();
    }
}

/**
 *
 * @param shape
 * @private
 */
HC.Layer.prototype._animateShape = function (shape) {

    let duration = this.getShapeRhythmPlugin();
    let delay = this.getShapeDelayPlugin();

    // wait until delay is over
    if (!delay.finished(shape)) {
        delay.update(shape, this.animation.diff);

        // wait until duration is over
    } else if (!duration.finished(shape)) {
        duration.update(shape, this.animation.diff);

        // reconfigure when finished
    } else {
        this.nextShapeRhythm(shape);
        this.nextShapeDelay(shape);
        this.nextShapeDirection(shape);
        this.nextShapeRotation(shape);

    }

    if (shape.isVisible()) {
        this.doPattern(shape);
        this.doOffsetMode(shape);
        this.doShapeTransform(shape);
        this.doSizing(shape);
        this.doRotationOffset(shape);
        this.doShapeLookat(shape);
        this.doLockingShapeRotation(shape);
        this.doColoring(shape);
        this.doMaterial(shape);
    }
};
