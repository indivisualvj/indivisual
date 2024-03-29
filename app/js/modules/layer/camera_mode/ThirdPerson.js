/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {CameraModePlugin} from "../CameraModePlugin";
import {Vector3} from "three";

class thirdperson extends CameraModePlugin {
    static name = 'third person view';

    apply() {
        let layer = this.layer;

        if (layer.shapes.length === 0) return;
        let camera = layer.getCamera();
        let shape = layer.getShape(0);
        let lookAt = new Vector3();
        shape.getWorldPosition(lookAt);
        let relativeCameraOffset = new Vector3(
            layer.shapeSize(1) * this.settings.camera_x,
            layer.shapeSize(1) * this.settings.camera_y,
            layer.shapeSize(-1) - layer.shapeSize(1) * this.settings.camera_z,
        );
        let cameraOffset = relativeCameraOffset.applyMatrix4(shape.sceneRotation().matrixWorld);
        camera.position.x = cameraOffset.x;
        camera.position.y = cameraOffset.y;
        camera.position.z = cameraOffset.z;
        camera.zoom = this.settings.camera_mode_volume;
        camera.lookAt(lookAt);
    }
}

export {thirdperson};
