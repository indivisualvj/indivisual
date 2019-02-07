HC.plugins.camera_mode.manual = _class(false, HC.CameraModePlugin, {
    index: 1,
    name: 'static look forward',
    apply: function (lookAtVector) {
        var layer = this.layer;

        var cam = layer.getCamera();
        var cdd = layer.cameraDefaultDistance(1);
        cam.zoom = this.settings.camera_mode_volume;
        cam.lookAt(layer.staticCenterVector);
        cam.position.set(
            0 + this.settings.camera_x * layer.halfDiameterVector.x,
            0 + this.settings.camera_y * layer.halfDiameterVector.y,
            cdd + cdd * this.settings.camera_z
        );
        cam.rotation.set(
            this.settings.camera_rotationx * RAD,
            this.settings.camera_rotationy * RAD,
            this.settings.camera_rotationz * RAD
        );
        if (lookAtVector) {
            cam.lookAt(lookAtVector);
        }
    }
});

HC.plugins.camera_mode.manualcenter = _class(false, HC.CameraModePlugin, {
    index: 2,
    name: 'static lookat center',
    apply: function () {
        this.layer
            .getCameraModePlugin('manual')
            .apply(this.layer.staticCenterVector);
    }
});