HC.plugins.shape_modifier.coneify = _class(false, HC.ShapeModifierPlugin, {
    name: 'coneify xyz by y',

    create: function (geometry, source, axes) {

            source = source || 'y';
            axes = axes || new THREE.Vector3(1, 1, 1);

            if (!this.angle) {
                this.angle = 0;
                this.min = 0;
                this.max = 0;
            }

            var dir = this.settings.shape_modifier_volume > 0 ? 1 : -1;

            var vertices = geometry.vertices;
            var vbackup = geometry.vertices;

            if (vertices) {

                for (var i = 0; i < vertices.length; i++) {

                    var vtc = vertices[i];
                    var vtcb = vbackup[i];

                    var v = vtcb[source];

                    this.min = Math.min(v, this.min);
                    this.max = Math.max(v, this.max);
                }

                for (var i = 0; i < vertices.length; i++) {

                    var vtc = vertices[i];
                    var vtcb = vbackup[i];

                    var v = vtcb[source];

                    var div = (this.min - this.max);

                    v = dir * (((v + .5 * div) / div)) / 2 * Math.abs(this.settings.shape_modifier_volume);

                    vtc.x = vtcb.x + vtcb.x * v * axes.x;
                    vtc.y = vtcb.y + vtcb.y * v * axes.y;
                    vtc.z = vtcb.z + vtcb.z * v * axes.z;

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

    create: function (shape) {
        return HC.plugins.shape_modifier.coneify.prototype.create.call(this, shape, 'y', new THREE.Vector3(1, 0, 1));
    }
});

HC.plugins.shape_modifier.coneifyxby = _class(false, HC.plugins.shape_modifier.coneify, {
    name: 'coneify x by y',

    create: function (shape) {
        return HC.plugins.shape_modifier.coneify.prototype.create.call(this, shape, 'y', new THREE.Vector3(1, 0, 0));
    }
});