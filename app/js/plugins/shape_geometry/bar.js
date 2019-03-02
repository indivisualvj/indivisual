HC.plugins.shape_geometry.barh = _class(false, HC.ShapeGeometryPlugin, {
    name: 'bar horizontal',
    create() {
        var layer = this.layer;

        return new THREE.PlaneGeometry(layer.shapeSize(1), layer.shapeSize(1) / 10);
    }
});

HC.plugins.shape_geometry.barv = _class(false, HC.ShapeGeometryPlugin, {
    name: 'bar vertical',
    create() {
        var layer = this.layer;

        return new THREE.PlaneGeometry(layer.shapeSize(1) / 10, layer.shapeSize(1));
    }
});
