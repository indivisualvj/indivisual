HC.plugins.shape_transform.drawranger = _class(false, HC.ShapeTransformPlugin, {
    name: 'drawrange random',

    apply: function (shape) {
        if (this.layer.getCurrentSpeed().prc == 0) {
            var l = shape.geometry.attributes.position.count - 1;
            var a = randomInt(0, l);
            var b = randomInt(a, l);
            shape.geometry.setDrawRange(a, b - a);
            shape.geometry.attributes.position.needsUpdate = true;
        }
    }
});