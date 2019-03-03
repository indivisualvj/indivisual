{
    HC.plugins.camera_mode.switch = class Plugin extends HC.CameraModePlugin {
        static name = 'switch position (current)';

        before() {
            this.layer.updateCameraFov();
        }

        apply(peak) {
            let speed = this.layer.getCurrentSpeed();
            let cam = this.layer.getCamera();

            cam.zoom = this.settings.camera_mode_volume;

            if ((!peak && speed.prc == 0) || (peak && audio.peak && randomBool())) {
                let pos = cam.position;

                pos.copy(this.layer.random3dPosition());
                cam.lookAt(new THREE.Vector3(0, 0, 0));

                return true;
            }
        }
    }
}
{
    HC.plugins.camera_mode.switchpeak = class Plugin extends HC.CameraModePlugin {
        static name = 'switch position (peak)';

        before() {
            this.layer.getCameraModePlugin('switch').before();
        }

        apply() {
            this.layer.getCameraModePlugin('switch').apply(true);
        }
    }
}
{
    HC.plugins.camera_mode.switchlookat = class Plugin extends HC.CameraModePlugin {
        static name = 'switch position lookat shape (current)';
        shape = false;
        lookAtVector = false;

        before() {
            this.layer.getCameraModePlugin('switch').before();
        }

        apply(peak) {

            let change = this.layer.getCameraModePlugin('switch').apply(peak);

            if (change) {
                let shape = this.layer.getRandomShape();
                this.shape = shape;
                if (!this.lookAtVector) {
                    this.lookAtVector = new THREE.Vector3();
                }
            }

            if (this.shape && this.lookAtVector) {
                this.shape.getWorldPosition(this.lookAtVector);
                this.layer.getCamera().lookAt(this.lookAtVector);
            }
        }
    }
}
{
    HC.plugins.camera_mode.switchlookatpeak = class Plugin extends HC.CameraModePlugin {
        static name = 'switch position lookat shape (peak)';
        shape = false;
        lookAtVector = false;

        before() {
            this.layer.getCameraModePlugin('switch').before();
        }

        apply() {
            this.layer.getCameraModePlugin('switchlookat').apply(true);
        }
    }
}