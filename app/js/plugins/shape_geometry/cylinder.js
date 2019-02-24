HC.plugins.shape_geometry.pipe = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;
        
        var size = layer.shapeSize(1);
        var halfSize = layer.shapeSize(.5);
        var segments = Math.pow(2, this.settings.shape_variant) / 2; // todo shape_segmentsa/segmentsb für alle die segments können. (1->128)
        var geometry = new THREE.CylinderGeometry(halfSize, halfSize, size, 16, segments, true);
        geometry.rotateX(90 * RAD);
        return geometry;
    }
});

HC.plugins.shape_geometry.cylinder = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;

        var size = layer.shapeSize(1);
        var halfSize = layer.shapeSize(.5);
        var segments = Math.pow(2, this.settings.shape_variant) / 2;
        var geometry = new THREE.CylinderGeometry(halfSize, halfSize, size, 16, segments, false);
        geometry.rotateX(90 * RAD);
        return geometry;
    }
});
