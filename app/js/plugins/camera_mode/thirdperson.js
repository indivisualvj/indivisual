HC.plugins.camera_mode.thirdperson = _class(false, HC.CameraModePlugin, {
    name: 'third person view',
    apply: function () {
        var layer = this.layer;

        if (layer.shapes.length == 0) return;
        var camera = layer.getCamera();
        var shape = layer.shapes[0];
        var lookAt = new THREE.Vector3();
        shape.getWorldPosition(lookAt);
        var relativeCameraOffset = new THREE.Vector3(
            layer.shapeSize(1) * this.settings.camera_x,
            layer.shapeSize(1) * this.settings.camera_y,
            layer.shapeSize(-2) - layer.shapeSize(1) * this.settings.camera_z,
        );
        var cameraOffset = relativeCameraOffset.applyMatrix4(shape._rotation.matrixWorld);
        camera.position.x = cameraOffset.x;
        camera.position.y = cameraOffset.y;
        camera.position.z = cameraOffset.z;
        camera.zoom = this.settings.camera_mode_volume;
        camera.lookAt(lookAt);
    }
});

