HC.plugins.camera_mode = HC.plugins.camera_mode || {};
{
    HC.CameraModePlugin = class Plugin extends HC.AnimationPlugin {
        before() {
            let layer = this.layer;
            layer.centerCamera();
            layer.updateCameraFov();
        }

        after() {
            let layer = this.layer;
            layer.getCamera().updateProjectionMatrix();
        }
    }
}