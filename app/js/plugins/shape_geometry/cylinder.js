HC.plugins.shape_geometry.pipe = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;


        var geometry = new THREE.CylinderGeometry(layer.shapeSize(.5), layer.shapeSize(.5), layer.shapeSize(1), 16, Math.pow(2, this.settings.shape_variant) / 2, true);
        geometry.rotateX(90 * RAD);
        return geometry;
    }
});

HC.plugins.shape_geometry.cylinder = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;


        var geometry = new THREE.CylinderGeometry(layer.shapeSize(.5), layer.shapeSize(.5), layer.shapeSize(1), 16, Math.pow(2, this.settings.shape_variant) / 2, false);
        geometry.rotateX(90 * RAD);
        return geometry;
    }
});
