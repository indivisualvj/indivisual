HC.plugins.camera_mode.manual = _class(false, HC.CameraModePlugin, {
    index: 1,
    name: 'static look forward',
    apply: function (lookAtVector) {
        var layer = this.layer;

        var cam = layer.getCamera();
        var dd = layer.cameraDefaultDistance();

        cam.zoom = this.settings.camera_mode_volume;
        cam.lookAt(new THREE.Vector3(0, 0, 0));
        cam.position.set(
            this.settings.camera_x * dd,
            this.settings.camera_y * dd,
            this.settings.camera_z * dd
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

HC.plugins.camera_mode.manualcenter = _class(false, HC.plugins.camera_mode.manual, {
    index: 2,
    name: 'static lookat center',
    apply: function () {
        HC.plugins.camera_mode.manual.prototype.apply.call(this, new THREE.Vector3(0, 0, 0));
    }
});

HC.plugins.camera_mode.lightingpatternxyz = _class(false, HC.plugins.camera_mode.manual, {
    name: 'look at lighting_patternxyz',
    apply: function () {
        var plugin = this.layer.getLightingPatternPlugin();
        HC.plugins.camera_mode.manual.prototype.apply.call(this, plugin.centerVector());
    }
});

HC.plugins.camera_mode.lightinglookatxyz = _class(false, HC.plugins.camera_mode.manual, {
    name: 'look at lighting_lookatxyz',
    apply: function () {
        var plugin = this.layer.getLightingLookatPlugin();
        HC.plugins.camera_mode.manual.prototype.apply.call(this, plugin.centerVector());
    }
});