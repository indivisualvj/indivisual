HC.plugins.camera_mode = HC.plugins.camera_mode || {};
{
    HC.CameraModePlugin = class Plugin extends HC.AnimationPlugin {

        setControlSets(controlSets) {
            super.setControlSets(controlSets);
            // make all such plugins make use of corresponding controlset only
            this.settings = controlSets.camera.properties;
        }

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
