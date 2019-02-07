HC.plugins.shape_transform.wave = _class(false, HC.ShapeTransformPlugin, {
    name: 'wave xyz by y',

    apply: function (shape, source, axes) {

        if (!shape.getVertices()) {
            shape.setGeometry(shape.geometry.userData.geometry);
        }

        source = source || 'y';
        axes = axes || new THREE.Vector3(1, 1, 1);

        if (!this.angle || shape.geometry != this.geometry) {
            this.geometry = shape.geometry;
            this.angle = 0;
            this.min = 0;
            this.max = 0;
        }

        this.angle += animation.getFrameDurationPercent(this.layer.getCurrentSpeed().duration, .005);

        var vertices = shape.getVertices();
        var vbackup = shape.verticesCopy;

        if (vertices && this.isFirstShape(shape)) {

            for (var i = 0; i < vertices.length; i++) {

                var vtc = vertices[i];
                var vtcb = vbackup[i];

                var v = vtcb[source];

                this.min = Math.min(v, this.min);
                this.max = Math.max(v, this.max);
                var div = Math.abs(this.min - this.max) / 20;

                v = Math.sin(this.angle * RAD + ((v+.5*div)/div)) / 2 * this.settings.shape_transform_volume;

                vtc.x = vtcb.x + vtcb.x * v * axes.x;
                vtc.y = vtcb.y + vtcb.y * v * axes.y;
                vtc.z = vtcb.z + vtcb.z * v * axes.z;

                shape.geometry.verticesNeedUpdate = true;

            }

        } else if (!vertices) {
            console.warn('No transform for ' + shape.geometry.type);
        }
    }
});

HC.plugins.shape_transform.wavexzby = _class(false, HC.ShapeTransformPlugin, {
    name: 'wave xz by y',

    apply: function (shape) {
        var layer = this.layer;
        layer.getShapeTransformPlugin('wave').apply(shape, 'y', new THREE.Vector3(1, 0, 1));
    }
});

HC.plugins.shape_transform.wavexby = _class(false, HC.ShapeTransformPlugin, {
    name: 'wave x by y',

    apply: function (shape) {
        var layer = this.layer;
        layer.getShapeTransformPlugin('wave').apply(shape, 'y', new THREE.Vector3(1, 0, 0));
    }
});