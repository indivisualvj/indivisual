HC.plugins.shape_geometry.plane = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;

        var segments = Math.pow(this.settings.shape_variant, this.settings.shape_variant);
        var geometry = new THREE.PlaneGeometry(layer.diameterVector.x, layer.diameterVector.y, segments, segments);
        return geometry;
    }
});

HC.plugins.shape_geometry.righttriangle = _class(false, HC.ShapeGeometryPlugin, {
    name: 'right triangle',
    create: function () {
        var layer = this.layer;


        var geometry = new HC.RightTriangle({width: layer.shapeSize(1), height: layer.shapeSize(1)}).create();

        return geometry;
    }
});
