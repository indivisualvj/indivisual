HC.plugins.shape_geometry.decagon = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;

        var geometry = new THREE.TetrahedronGeometry(layer.shapeSize(.5), this.settings.shape_variant - 1);
        return geometry;
    }
});

HC.plugins.shape_geometry.dodecagon = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;

        var geometry = new THREE.OctahedronGeometry(layer.shapeSize(.5), this.settings.shape_variant - 1);
        return geometry;
    }
});

HC.plugins.shape_geometry.hectagon = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;

        var geometry = new THREE.IcosahedronGeometry(layer.shapeSize(.5), this.settings.shape_variant - 1);
        return geometry;
    }
});

HC.plugins.shape_geometry.icosagon = _class(false, HC.ShapeGeometryPlugin, {
    name: 'sphere',
    create: function () {
        var layer = this.layer;

        var geometry = new THREE.IcosahedronGeometry(layer.shapeSize(.5), this.settings.shape_variant);
        return geometry;
    }
});
