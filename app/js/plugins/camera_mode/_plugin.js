HC.plugins.camera_mode = HC.plugins.camera_mode || {};

HC.CameraModePlugin = _class(false, HC.AnimationPlugin, {
    before: function () {
        var layer = this.layer;
        layer.centerCamera();
        layer.updateCameraFov();
    },

    after: function () {
        var layer = this.layer;
        layer.getCamera().updateProjectionMatrix();
    }
});
