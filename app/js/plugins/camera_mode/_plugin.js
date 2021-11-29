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
            this.centerCamera();
            layer.updateCameraFov();
        }


        /**
         *
         */
        centerCamera() {
            let cam = this.layer.getCamera();
            cam.position.x = 0;
            cam.position.y = 0;
            cam.position.z = this.cameraDefaultDistance();
        }


        after() {
            let layer = this.layer;
            layer.getCamera().updateProjectionMatrix();
        }
    }
}
