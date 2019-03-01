HC.plugins.shape_modifier.coneify = _class(false, HC.ShapeModifierPlugin, {
    name: 'coneify xyz by y',

    create(geometry, source, axes) {

        source = source || 'y';
        axes = axes || new THREE.Vector3(1, 1, 1);

        var vertices = geometry.vertices;

        if (vertices) {

            this.min = this.max = 0;

            for (var i = 0; i < vertices.length; i++) {

                var vtc = vertices[i];
                var v = vtc[source];

                this.min = Math.min(v, this.min);
                this.max = Math.max(v, this.max);
            }

            for (var i = 0; i < vertices.length; i++) {

                var vtc = vertices[i];
                var v = vtc[source] * this.settings.shape_modifier_volume;
                var div = Math.abs(this.min - this.max);
                v /= div;

                vtc.x += vtc.x * v * axes.x;
                vtc.y += vtc.y * v * axes.y;
                vtc.z += vtc.z * v * axes.z;

                geometry.verticesNeedUpdate = true;

            }

        } else if (!vertices) {
            console.warn('No transform for ' + geometry.type);
        }

        return geometry
    }
});

HC.plugins.shape_modifier.coneifyxzby = _class(false, HC.plugins.shape_modifier.coneify, {
    name: 'coneify xz by y',

    create(shape) {
        return HC.plugins.shape_modifier.coneify.prototype.create.call(this, shape, 'y', new THREE.Vector3(1, 0, 1));
    }
});

HC.plugins.shape_modifier.coneifyxby = _class(false, HC.plugins.shape_modifier.coneify, {
    name: 'coneify x by y',

    create(shape) {
        return HC.plugins.shape_modifier.coneify.prototype.create.call(this, shape, 'y', new THREE.Vector3(1, 0, 0));
    }
});

HC.plugins.shape_modifier.coneifyxybz = _class(false, HC.plugins.shape_modifier.coneify, {
    name: 'coneify xy by z',

    create(shape) {
        return HC.plugins.shape_modifier.coneify.prototype.create.call(this, shape, 'z', new THREE.Vector3(1, 1, 0));
    }
});