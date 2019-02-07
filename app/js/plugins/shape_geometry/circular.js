HC.plugins.shape_geometry.rue = _class(false, HC.ShapeGeometryPlugin, {
    name: 'rue',
    create: function () {
        var layer = this.layer;

        //rue
        var geometry = new HC.DirectionalShape({
            radius: layer.shapeSize(.5),
            sides: 4,
            direction: this.settings.shape_variant
        }).create();

        return geometry;
    }
});

HC.plugins.shape_geometry.triangle = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;

        var geometry = new HC.DirectionalShape({
            radius: layer.shapeSize(.5),
            sides: 3,
            direction: this.settings.shape_variant
        }).create();

        return geometry;
    }
});

HC.plugins.shape_geometry.pentagon = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;

        var geometry = new HC.DirectionalShape({
            radius: layer.shapeSize(.5),
            sides: 5,
            direction: this.settings.shape_variant
        }).create();
        return geometry;
    }
});

HC.plugins.shape_geometry.hexagon = _class(false, HC.ShapeGeometryPlugin, {
    name: 'hexagon',
    create: function () {
        var layer = this.layer;

        var geometry = new HC.DirectionalShape({
            radius: layer.shapeSize(.5),
            sides: 6,
            direction: this.settings.shape_variant
        }).create();
        return geometry;
    }
});

HC.plugins.shape_geometry.octagon = _class(false, HC.ShapeGeometryPlugin, {
    name: 'octagon',
    create: function () {
        var layer = this.layer;

        var geometry = new HC.DirectionalShape({
            radius: layer.shapeSize(.5),
            sides: 8,
            direction: this.settings.shape_variant
        }).create();
        return geometry;
    }
});

HC.plugins.shape_geometry.circle = _class(false, HC.ShapeGeometryPlugin, {
    name: 'circle',
    create: function () {
        var layer = this.layer;

        var geometry = new THREE.CircleGeometry(layer.shapeSize(.5), 24 + 8 * (this.settings.shape_variant - 1));
        return geometry;
    }
});

HC.plugins.shape_geometry.ring = _class(false, HC.ShapeGeometryPlugin, {
    name: 'ring',
    create: function () {
        var layer = this.layer;

        var geometry = new THREE.RingGeometry(layer.shapeSize(.5) / 2, layer.shapeSize(.5), 24);
        return geometry;
    }
});
