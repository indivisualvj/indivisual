HC.plugins.shape_modifier.extrude = _class(false, HC.ShapeModifierPlugin, {
    name: 'extrude',

    create: function (geometry) {
        var layer = this.layer;

        var shape;
        var moved = false;

        if (geometry.parameters && geometry.parameters.shapes) {
            shape = geometry.parameters.shapes;

        } else {
            shape = new THREE.Shape();
            geometry.center();

            var vertices = geometry.vertices;

            for (var i in vertices) {
                var v = vertices[i];

                if (v.z != 0) {
                    console.warn('No extrusion for 3D geometries');
                    return;
                }

                if (v.x != 0 || v.y != 0) {
                    if (moved === false) {
                        shape.moveTo(v.x, v.y);
                        moved = i;

                    } else {
                        shape.lineTo(v.x, v.y);
                    }
                }
            }
            if (moved !== false) {
                var v = vertices[moved];
                shape.lineTo(v.x, v.y);

            } else {
                shape = false;
            }
        }

        if (shape) {
            var conf = {
                steps: 1,
                depth: layer.shapeSize(this.settings.shape_modifier_volume),
                bevelEnabled: this.settings.shape_variant - 1,
                bevelThickness: this.settings.shape_variant,
                bevelSize: this.settings.shape_variant,
                bevelSegments: this.settings.shape_variant,
            };

            geometry = new THREE.ExtrudeGeometry(shape, conf);
            geometry.center();
            geometry.verticesNeedUpdate = true;

            this.assignUVs(geometry);
        }

        return geometry;
    }
});