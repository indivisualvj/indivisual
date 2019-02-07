HC.plugins.shape_geometry.plane = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;

        var matrix = layer.getPatternPlugin('matrix');
        var geometry = new THREE.PlaneGeometry(layer.diameterVector.x, layer.diameterVector.y, matrix.columnCount(layer), matrix.rowCount(layer));
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
