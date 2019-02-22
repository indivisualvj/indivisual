HC.plugins.camera_mode = HC.plugins.camera_mode || {};
{
    class Plugin extends HC.AnimationPlugin {
        before () {
            var layer = this.layer;
            layer.centerCamera();
            layer.updateCameraFov();
        }

        after () {
            var layer = this.layer;
            layer.getCamera().updateProjectionMatrix();
        }
    }

    HC.CameraModePlugin = Plugin
}