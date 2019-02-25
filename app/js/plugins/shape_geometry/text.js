HC.plugins.shape_geometry.text = _class(false, HC.ShapeGeometryPlugin, {
    name: 'text (coolvetica)',
    create: function () {
        var geometry = new THREE.TextGeometry(this.settings.shape_vertices || 'indivisual', {
            font: assetman.fonts.coolvetica,
            size: this.layer.shapeSize(.19),
            height: this.settings.shape_variant * 10,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: .1,
            bevelSegments: 3
        });
        geometry.center();
        return geometry;
    }
});