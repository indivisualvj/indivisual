HC.plugins.shape_geometry.text = _class(false, HC.ShapeGeometryPlugin, {
    name: 'text (coolvetica)',
    create: function () {
        var geometry = new THREE.TextGeometry(this.settings.shape_vertices || 'indivisual', {
            font: assetman.fonts.coolvetica,
            size: this.layer.shapeSize(.19),
            // height: this.settings.shape_moda * 10,
            curveSegments: this.getModA(1, 1, 12),
            bevelEnabled: this.settings.shape_modb,
            bevelThickness: this.getModB(1, 1),
            bevelSize: this.getModC(1, 1) / 8,
            bevelSegments: this.getModA(1, 1, 12)
        });
        geometry.center();
        return geometry;
    }
});