HC.plugins.shape_transform.wave = _class(false, HC.ShapeTransformPlugin, {
    name: 'wave xyz by y',

    apply: function (shape, source, axes) {

        if (!shape.getVertices()) {
            shape.setGeometry(shape.geometry.userData.geometry);
        }

        if (this.isFirstShape(shape)) {
            source = source || 'y';
            axes = axes || new THREE.Vector3(1, 1, 1);

            if (!this.angle || shape.geometry != this.geometry) {
                this.geometry = shape.geometry;
                this.angle = 0;
                this.min = 0;
                this.max = 0;
            }

            var dir = this.settings.shape_transform_volume > 0 ? 1 : -1;
            this.angle += dir * animation.getFrameDurationPercent(this.layer.getCurrentSpeed().duration, .005);

            var vertices = shape.getVertices();
            var vbackup = shape.verticesCopy;

            if (vertices) {

                for (var i = 0; i < vertices.length; i++) {

                    var vtc = vertices[i];
                    var vtcb = vbackup[i];

                    var v = vtcb[source];

                    this.min = Math.min(v, this.min);
                    this.max = Math.max(v, this.max);
                    var div = Math.abs(this.min - this.max) / 20;

                    v = Math.sin(this.angle * RAD + ((v + .5 * div) / div)) / 2 * Math.abs(this.settings.shape_transform_volume);

                    vtc.x = vtcb.x + vtcb.x * v * axes.x;
                    vtc.y = vtcb.y + vtcb.y * v * axes.y;
                    vtc.z = vtcb.z + vtcb.z * v * axes.z;

                }
                shape.geometry.verticesNeedUpdate = true;

            } else if (!vertices) {
                console.warn('No transform for ' + shape.geometry.type);
            }
        }
    }
});

HC.plugins.shape_transform.wavexzby = _class(false, HC.plugins.shape_transform.wave, {
    name: 'wave xz by y',

    apply: function (shape) {
        HC.plugins.shape_transform.wave.prototype.apply.call(this, shape, 'y', new THREE.Vector3(1, 0, 1));
    }
});

HC.plugins.shape_transform.wavexby = _class(false, HC.plugins.shape_transform.wave, {
    name: 'wave x by y',

    apply: function (shape) {
        HC.plugins.shape_transform.wave.prototype.apply.call(this, shape, 'y', new THREE.Vector3(1, 0, 0));
    }
});

HC.plugins.shape_transform.wavexybz = _class(false, HC.plugins.shape_transform.wave, {
    name: 'wave xy by z',

    apply: function (shape) {
        HC.plugins.shape_transform.wave.prototype.apply.call(this, shape, 'z', new THREE.Vector3(1, 1, 0));
    }
});