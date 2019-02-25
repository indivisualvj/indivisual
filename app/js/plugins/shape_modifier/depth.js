HC.plugins.shape_modifier.depth = _class(false, HC.ShapeModifierPlugin, {
    name: 'depth center',

    create: function (geometry, mode) {
        var layer = this.layer;
        var z = 0;

        var vertices = geometry.vertices;
        geometry.center();

        for (var i = 0; i < vertices.length; i++) {
            var vtc = vertices[i];

            switch (mode) {

                default:
                case 'center':
                    z = new THREE.Vector2(vtc.x, vtc.y).length() * -.5;
                    break;

                case 'flat':
                    z = 0;
                    break;

                case 'zigzag':
                    z = Math.sin(Math.abs(vtc.x * 10)) * -.5 + Math.cos(Math.abs(vtc.y * 10)) * -layer.shapeSize(.5);
                    break;

                case 'random':
                    z = Math.sin(Math.abs(vtc.x * randomInt(0, 10))) * -.5 + Math.cos(Math.abs(vtc.y * randomInt(0, 10))) * -layer.shapeSize(.5);
                    break;

                case 'sinus':
                    z = Math.sin(Math.abs(vtc.x)) * -1 + Math.cos(Math.abs(vtc.y)) * -layer.shapeSize(.5);
                    break;

            }

            vtc.z = z * this.settings.shape_modifier_volume;
        }

        geometry.center();

        return geometry;
    }
});

HC.plugins.shape_modifier.depthzigzag = _class(false, HC.plugins.shape_modifier.depth, {
    name: 'depth zigzag',
    create: function (geometry) {
        return HC.plugins.shape_modifier.depth.prototype.create.call(this, geometry, 'zigzag');
    }
});