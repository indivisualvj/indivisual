/**
 *
 * @param shape
 */
HC.Layer.prototype.animateShape = function (shape) {

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

/**
 *
 * @param hook
 */
HC.Layer.prototype.animate = function (hook) {

    if (this.shapes === false) {
        this.resetShapes();
    }

    this.tween.update(this.animation.now - this.lastUpdate, false);

    this.doOscillate(true);

    this.rotation(this.settings.layer_rotationx, this.settings.layer_rotationy, this.settings.layer_rotationz);
    this.position(this.settings.layer_positionx, this.settings.layer_positiony, this.settings.layer_positionz);

    this.doCameraMode();

    let materialColor = this.doMaterialMap();

    this.animateShape(this.shape);
    this.doPatternRotation(); // preset current pattern euler from layer's shape rotation

    let shapeNeedsUpdate = this.settings.material_needs_update;

    for (let i = 0; i < this.shapes.length; i++) {
        let shape = this.shapes[i];
        this.animateShape(shape, true);
        shape.needsUpdate = shapeNeedsUpdate;
    }

    this.settings.material_needs_update = false;

    this.doLighting(materialColor);
    this.doBackground();

    if (hook) {
        hook();
    }

    this.doOscillate(false);
};
