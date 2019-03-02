HC.plugins.shape_transform.drawranger = class Plugin extends HC.ShapeTransformPlugin {
    static name = 'drawrange random';

    apply(shape) {
        if (this.layer.getCurrentSpeed().prc == 0) {
            let l = shape.geometry.attributes.position.count - 1;
            let a = randomInt(0, l);
            let b = randomInt(a, l);
            shape.geometry.setDrawRange(a, b - a);
            shape.geometry.attributes.position.needsUpdate = true;
        }
    }
}