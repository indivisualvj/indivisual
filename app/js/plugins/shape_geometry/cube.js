HC.plugins.shape_geometry.cube = _class(false, HC.ShapeGeometryPlugin, {
    name: 'cube',
    create: function () {
        var layer = this.layer;


        var geometry = new THREE.BoxGeometry(layer.shapeSize(1), layer.shapeSize(1), layer.shapeSize(1));
        return geometry;
    }
});

HC.plugins.shape_geometry.cubelongh = _class(false, HC.ShapeGeometryPlugin, {
    name: 'cube long horizontal',
    create: function () {
        var layer = this.layer;


        var geometry = new THREE.BoxGeometry(Math.max(renderer.width, renderer.height) * 2, layer.shapeSize(1) / 5, layer.shapeSize(1) / 5);
        return geometry;
    }
});

HC.plugins.shape_geometry.cubelongv = _class(false, HC.ShapeGeometryPlugin, {
    name: 'cube long vertical',
    create: function () {
        var layer = this.layer;


        var geometry = new THREE.BoxGeometry(layer.shapeSize(1) / 5, Math.max(renderer.width, renderer.height) * 2, layer.shapeSize(1) / 5);
        return geometry;
    }
});

HC.plugins.shape_geometry.cubeedged = _class(false, HC.ShapeGeometryPlugin, {
    name: 'cube edged ',
    create: function () {
        var layer = this.layer;

        var box = new THREE.BoxGeometry(layer.shapeSize(1), layer.shapeSize(1), layer.shapeSize(1));
        var oct = new THREE.OctahedronGeometry(layer.shapeSize(1) * 1.25);
        var geo = new ThreeBSP(box);
        var sub = new ThreeBSP(oct);
        geo = geo.intersect(sub);
        var geometry = geo.toGeometry();

        this.assignUVs(geometry);
        return geometry;
    }
});
