HC.plugins.lighting_type.star = _class(false, HC.LightingTypePlugin, {
    create: function () {
        var light = new THREE.PointLight(0xffffff);
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.far = 10000;

        var sphere = new THREE.SphereBufferGeometry(this.layer.shapeSize(.5), 16, 16);
        var material = new THREE.MeshBasicMaterial({color: 0xffffff});
        material.color = light.color;
        var mesh = new THREE.Mesh(sphere, material);
        light.add(mesh);

        return light;
    },

    update: function (light) {
        HC.LightingTypePlugin.prototype.update.call(this, light);

        for (var c in light.children) {
            var child = light.children[c];
            if (child.scale) {
                var s = this.settings.lighting_intensity / 2;
                child.scale.x = s;
                child.scale.y = s;
                child.scale.z = s;
            }
        }
    }
});