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

    if (this.needsReset) {
        this.fullReset();
        return;
    }

    this.listener.fireEvent(EVENT_LAYER_ANIMATE);

    this.tween.update(this.animation.now - this.lastUpdate, false);

    this.doOscillate(true);

    this.rotation(this.settings.layer_rotationx, this.settings.layer_rotationy, this.settings.layer_rotationz);
    this.position(this.settings.layer_positionx, this.settings.layer_positiony, this.settings.layer_positionz);

    this.doCameraMode();

    this.materialColor = this.doMaterialMap();

    this.animateShape(this.shape);
    this.doPatternRotation(); // preset current pattern euler from layer's shape rotation

    let shapeNeedsUpdate = this.settings.material_needs_update; // todo bound to lastchange todo for CS

    for (let i = 0; i < this.shapes.length; i++) {
        let shape = this.shapes[i];
        this.animateShape(shape, true);
        shape.needsUpdate = shapeNeedsUpdate;
    }

    this.settings.material_needs_update = false;

    this.doLighting(this.materialColor);
    this.doBackground();

    this.doOscillate(false);
};
