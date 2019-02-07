HC.plugins.shape_geometry.rect = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;
        var geometry = new HC.DirectionalCircle({
            radius: layer.shapeSize(SQUARE_DIAMETER/2),
            sides: 4,
            direction: 7
        }).create();
        // var geometry = new THREE.PlaneGeometry(layer.shapeSize(1), layer.shapeSize(1), 1, 1);
        return geometry;
    }
});

HC.plugins.shape_geometry.tile = _class(false, HC.ShapeGeometryPlugin, {
    index: 1,
    create: function () {
        var layer = this.layer;

        var geometry = new HC.RoundedRect(layer.shapeSize(1), layer.shapeSize(1)).create();
        this.assignUVs(geometry);
        return geometry;
    }
});
