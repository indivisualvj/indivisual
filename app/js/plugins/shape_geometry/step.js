HC.plugins.shape_geometry.stepcircle = _class(false, HC.ShapeGeometryPlugin, {
    tutorial: {
        variants: {
            text: 'Set shape_variant to a higher value to create more steps.',
            action: function () {
                controller.closeAll();
                controller.toggleByProperty('shape_variant');
                controller.updateSetting(statics.ControlSettings.layer, 'shape_variant', 6, true, true);
            },
        },
        visibility: {
            text: 'Modify coloring_opacity to make the single steps shine through. Also take care that material_blending is set to normal/additive',
            action: function () {
                controller.closeAll();
                controller.toggleByProperty('coloring_opacity');
                controller.updateSetting(statics.ControlSettings.layer, 'coloring_opacity', .5, true, true);
                controller.updateSetting(statics.ControlSettings.layer, 'material_blending', 'NormalBlending', true, true, true);
            },
        }
    },
    create: function () {
        var layer = this.layer;

        var div = this.settings.shape_variant;
        var step = layer.shapeSize(.5) / div;
        var z = 0;
        var geometry = new THREE.Geometry();
        for (var i = step; i <= layer.shapeSize(.5); i += step) {
            var circ = new THREE.CircleGeometry(i, 32);
            circ.translate(0, 0, 3*z++);
            var mesh = new THREE.Mesh(circ);
            geometry.merge(mesh.geometry, mesh.matrix);
        }

        return geometry;
    }
});

HC.plugins.shape_geometry.stepring = _class(false, HC.ShapeGeometryPlugin, {
    tutorial: HC.plugins.shape_geometry.stepcircle.prototype.tutorial,
    create: function () {
        var layer = this.layer;

        var div = this.settings.shape_variant;
        var step = layer.shapeSize(.5) / div;
        var hstep = step / 2;
        var geometry = new THREE.Geometry();
        for (var i = step; i <= layer.shapeSize(.5); i += step) {
            var circ = new THREE.RingGeometry(i - hstep, i, 32);
            // var circ = new THREE.CircleGeometry(i, 32);
            var mesh = new THREE.Mesh(circ);
            geometry.merge(mesh.geometry, mesh.matrix);
        }

        return geometry;
    }
});

HC.plugins.shape_geometry.steprect = _class(false, HC.ShapeGeometryPlugin, {
    tutorial: HC.plugins.shape_geometry.stepcircle.prototype.tutorial,
    create: function () {
        var layer = this.layer;

        var div = this.settings.shape_variant;
        var r = layer.shapeSize(SQUARE_DIAMETER / 2);
        var step = r / div;
        var z = 0;
        var geometry = new THREE.Geometry();
        for (var i = step; i <= r; i += step) {
            var circ = new THREE.CircleGeometry(i, 4, Math.PI / 4);
            circ.translate(0, 0, 3*z++);
            var mesh = new THREE.Mesh(circ);
            geometry.merge(mesh.geometry, mesh.matrix);
        }
        return geometry;
    }
});
