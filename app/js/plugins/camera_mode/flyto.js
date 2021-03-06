{
    HC.plugins.camera_mode.flytoshape = class Plugin extends HC.CameraModePlugin {
        static name = 'fly to shape';

        before() {
            // disable super.before
            this.layer.updateCameraFov();
        }

        apply(peak) {
            let layer = this.layer;

            let lookatshape = layer.getCameraModePlugin('lookatshape');
            lookatshape.apply(peak, false);

            let cam = layer.getCamera();
            let shared = lookatshape.shared;

            let pos = cam.position;
            let distance = pos.distanceTo(shared.targetLook);

            if (distance > layer.shapeSize(shared.shape.size()) * 3) {
                let speed = beatkeeper.getSpeed('full');
                let prog = animation.getFrameDurationPercent(speed.duration, .75);

                cam.translateZ(-prog * distance / 2);
            }
        }
    }
}
{
    HC.plugins.camera_mode.flytoshapepeak = class Plugin extends HC.CameraModePlugin {
        static name = 'fly to shape on peak';

        apply() {
            let layer = this.layer;

            layer.getCameraModePlugin('flytoshape').apply(true);
        }
    }
}