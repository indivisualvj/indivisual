HC.plugins.shape_transform.audio = _class(false, HC.ShapeTransformPlugin, {
    name: 'audio xyz',

    apply: function (shape, axis) {

        if (!shape.getVertices()) {
            shape.setGeometry(shape.geometry.userData.geometry);
        }

        var vbackup = shape.verticesCopy;
        var vertices = shape.getVertices();

        if (vertices && vbackup && this.isFirstShape(shape)) {

            var ai = 0;
            for (var i = 0; i < vertices.length; i++) {

                var x = 1, y = 1, z = 1;

                var v = this.settings.shape_sync ? audio.volume : audio.volumes[ai++];
                if (ai >= audio.volumes.length) { // cycle through frequency volumes until all vertices have data
                    ai = 0;
                }

                if (this.settings.shape_limit) {
                    v += 1.0;
                }

                v *= this.settings.shape_transform_volume;

                if (axis) {
                    switch (axis) {
                        case 'x':
                            x *= v;
                            break;
                        case 'y':
                            y *= v;
                            break;
                        case 'z':
                            z *= v;
                            break;
                        case 'xy':
                            x *= v;
                            y *= v;
                            break;
                    }
                } else {
                    x *= v;
                    y *= v;
                    z *= v;
                }

                var vtc = vertices[i];
                var vtcb = vbackup[i];
                vtc.x = vtcb.x * x;
                vtc.y = vtcb.y * y;
                vtc.z = vtcb.z * z;

            }
            shape.geometry.verticesNeedUpdate = true;

        } else if (!vertices) {
            console.warn('No transform for ' + shape.geometry.type);
        }
    }
});

HC.plugins.shape_transform.audiox = _class(false, HC.plugins.shape_transform.audio, {
    name: 'audio x',

    apply: function (shape) {
        HC.plugins.shape_transform.audio.prototype.apply.call(this, shape, 'x');
    }
});

HC.plugins.shape_transform.audioy = _class(false, HC.plugins.shape_transform.audio, {
    name: 'audio y',

    apply: function (shape) {
        HC.plugins.shape_transform.audio.prototype.apply.call(this, shape, 'y');
    }
});

HC.plugins.shape_transform.audioz = _class(false, HC.plugins.shape_transform.audio, {
    name: 'audio z',

    apply: function (shape) {
        HC.plugins.shape_transform.audio.prototype.apply.call(this, shape, 'z');
    }
});

HC.plugins.shape_transform.audioxy = _class(false, HC.plugins.shape_transform.audio, {
    name: 'audio xy',

    apply: function (shape) {
        HC.plugins.shape_transform.audio.prototype.apply.call(this, shape, 'xy');
    }
});