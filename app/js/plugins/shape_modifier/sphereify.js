HC.plugins.shape_modifier.sphereify = _class(false, HC.ShapeModifierPlugin, {
    name: 'sphereify',

    create(geometry) {

        var vertices = geometry.vertices;
        geometry.center();

        if (vertices) {

            this.radius = 0;

            for (var i = 0; i < vertices.length; i++) {

                var vtc = vertices[i];
                this.radius = Math.max(vtc.length(), this.radius);
            }

            for (var i = 0; i < vertices.length; i++) {

                var vtc = vertices[i];
                var l = vtc.length();
                var m = Math.max(0.001, Math.abs(this.settings.shape_modifier_volume));

                vtc.multiplyScalar(m);
                vtc.clampLength(l, this.radius);

                geometry.verticesNeedUpdate = true;

            }

        } else if (!vertices) {
            console.warn('No transform for ' + geometry.type);
        }

        return geometry
    }
});