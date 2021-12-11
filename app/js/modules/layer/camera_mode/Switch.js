/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {CameraModePlugin} from "../CameraModePlugin";
import {Vector3} from "three";

class switchposition extends CameraModePlugin {
    static name = 'switch position (current)';

    before() {
        this.layer.updateCameraFov();
    }

    apply(peak) {
        let speed = this.layer.currentSpeed();
        let cam = this.layer.getCamera();

        cam.zoom = this.settings.camera_mode_volume;

        if ((!peak && speed.prc === 0) || (peak && this.audioAnalyser.peak && randomBool())) {
            let pos = cam.position;

            pos.copy(this.layer.getPatternPlugin().random3dPosition());
            cam.lookAt(new Vector3(0, 0, 0));

            return true;
        }
    }
}


class switchpeak extends CameraModePlugin {
    static name = 'switch position (peak)';

    before() {
        this.layer.getCameraModePlugin('switchposition').before();
    }

    apply() {
        this.layer.getCameraModePlugin('switchposition').apply(true);
    }
}


class switchlookat extends CameraModePlugin {
    static name = 'switch position lookat shape (current)';
    shape = false;
    lookAtVector = false;

    before() {
        this.layer.getCameraModePlugin('switchposition').before();
    }

    apply(peak) {

        let change = this.layer.getCameraModePlugin('switchposition').apply(peak);

        if (change) {
            this.shape = this.layer.randomShape();
            if (!this.lookAtVector) {
                this.lookAtVector = new Vector3();
            }
        }

        if (this.shape && this.lookAtVector) {
            this.shape.getWorldPosition(this.lookAtVector);
            this.layer.getCamera().lookAt(this.lookAtVector);
        }
    }
}


class switchlookatpeak extends CameraModePlugin {
    static name = 'switch position lookat shape (peak)';
    shape = false;
    lookAtVector = false;

    before() {
        this.layer.getCameraModePlugin('switchposition').before();
    }

    apply() {
        this.layer.getCameraModePlugin('switchlookat').apply(true);
    }
}

export {switchlookat, switchlookatpeak, switchpeak, switchposition};
