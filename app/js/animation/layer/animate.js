/**
 *
 * @param shape
 */
HC.Layer.prototype.animateShape = function (shape) {

    var duration = this.getShapeRhythmPlugin();
    var delay = this.getShapeDelayPlugin();

    // wait until delay is over
    if (!delay.finished(shape)) {
        delay.update(shape, animation.diff);

        // wait until duration is over
    } else if (!duration.finished(shape)) {
        duration.update(shape, animation.diff);

        // reconfigure when finished
    } else {
        this.nextShapeRhythm(shape);
        this.nextShapeDelay(shape);
        this.nextShapeDirection(shape);
        this.nextShapeRotation(shape);

    }

    if (!shape.dummy) {
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

    this.tween.update(animation.now - this.lastUpdate, false);

    this.doOscillate(true);

    this.rotation(this.settings.layer_rotationx, this.settings.layer_rotationy, this.settings.layer_rotationz);

    this.doCameraMode();

    var materialColor = this.doMaterialMap();

    this.animateShape(this.shape);
    this.doPatternRotation(); // preset current pattern euler from layer's shape rotation

    for (var i = 0; i < this.shapes.length; i++) {
        var shape = this.shapes[i];

        this.animateShape(shape, true);
    }

    this.doLighting(materialColor);
    this.doBackground();

    if (hook) {
        hook();
    }

    this.doOscillate(false);
};