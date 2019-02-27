HC.plugins.shape_geometry.bacillush = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;

        var shape = new THREE.Shape();

        var hw = layer.shapeSize(.5) * .75;
        var hh = layer.shapeSize(.5) / 6;
        var r = hh;
        shape.moveTo(-hw, hh);
        shape.lineTo(hw, hh);
        shape.absarc(hw, 0, r, .5 * Math.PI, 1.5 * Math.PI, true);
        shape.lineTo(-hw, -hh);
        shape.absarc(-hw, 0, r, 1.5 * Math.PI, 2.5 * Math.PI, true);

        return new THREE.ShapeGeometry(shape); // todo curveSegments
    }
});

HC.plugins.shape_geometry.bacillusv = _class(false, HC.ShapeGeometryPlugin, {
    create: function () {
        var layer = this.layer;

        var shape = new THREE.Shape();

        var hw = layer.shapeSize(.5) / 6;
        var hh = layer.shapeSize(.5) * .75;
        var r = hw;
        shape.moveTo(-hw, hh);
        shape.lineTo(-hw, -hh);
        shape.absarc(0, hh, r, 1 * Math.PI, 2 * Math.PI, true);
        shape.lineTo(hw, hh);
        shape.absarc(0, -hh, r, 0 * Math.PI, 1 * Math.PI, true);

        return new THREE.ShapeGeometry(shape); // todo curveSegments
    }
});
