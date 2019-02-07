HC.plugins.shape_geometry.stepcircle = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;


        var div = 5;
        var step = layer.shapeSize(.5) / div;
        var geometry = new THREE.Geometry();
        for (var i = step; i <= layer.shapeSize(.5); i += step) {
            var circ = new THREE.CircleGeometry(i, 32);
            var mesh = new THREE.Mesh(circ);
            geometry.merge(mesh.geometry, mesh.matrix);
        }

        return geometry;
    }
});

HC.plugins.shape_geometry.stepring = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;


        var div = 5;
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
    create: function () {
        var layer = this.layer;


        var div = 5;
        var r = layer.shapeSize(SQUARE_DIAMETER/2);
        var step = r / div;
        var geometry = new THREE.Geometry();
        for (var i = step; i <= r; i += step) {
            var circ = new THREE.CircleGeometry(i, 4, Math.PI / 4);
            var mesh = new THREE.Mesh(circ);
            geometry.merge(mesh.geometry, mesh.matrix);
        }
        return geometry;
    }
});
