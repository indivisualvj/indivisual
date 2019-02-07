HC.plugins.shape_geometry.cube = _class(false, HC.ShapeGeometryPlugin, {
    name: 'cube',
    create: function () {
        var layer = this.layer;

        var size = layer.shapeSize(1);
        var segments = this.settings.shape_variant;

        var geometry = new THREE.BoxGeometry(size, size, size, segments, segments, segments);
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
