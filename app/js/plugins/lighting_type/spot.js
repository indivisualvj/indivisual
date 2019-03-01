HC.plugins.lighting_type.spot = _class(false, HC.LightingTypePlugin, {
    create() {
        var light = new THREE.SpotLight(0xffffff);
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.fov = 90;
        light.shadow.camera.far = 10000;
        return light;
    }
});