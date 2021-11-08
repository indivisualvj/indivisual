{
    HC.plugins.camera_mode.mirror = class Plugin extends HC.CameraModePlugin {
        static name = 'mirror XYZ position (current)';
        mirror = new THREE.Vector3(1, 1, 1);

        apply(peak) {

            let speed = this.layer.getCurrentSpeed();
            if ((peak && this.audioAnalyser.peak && randomBool()) || (!peak && speed.prc === 0)) {
                this.mirror.x = randomBool() ? -1 : 1;
                this.mirror.y = randomBool() ? -1 : 1;
                this.mirror.z = randomBool() ? -1 : 1;
            }

            this.layer.getCameraModePlugin('manual').apply();
            let cam = this.layer.getCamera();
            cam.position.x *= this.mirror.x;
            cam.position.y *= this.mirror.y;
            cam.position.z *= this.mirror.z;

            cam.lookAt(new THREE.Vector3(0, 0, 0));
        }
    }
}
{
    HC.plugins.camera_mode.mirrorpeak = class Plugin extends HC.CameraModePlugin {
        static name = 'mirror XYZ position (peak)';

        apply() {
            this.layer.getCameraModePlugin('mirror').apply(true);
        }
    }
}
