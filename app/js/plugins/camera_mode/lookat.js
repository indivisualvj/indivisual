{
    HC.plugins.camera_mode.lookatshape = class Plugin extends HC.CameraModePlugin {
        static name = 'look at a shape';
        targetLook = new THREE.Vector3(0, 0, 0);
        currentLook = new THREE.Vector3(0, 0, 0);
        shape = false;
        entry = 0;
        _tween = false;
        quatFrom = false;
        quatTo = false;
        shared = {
            shape: false,
            targetLook: new THREE.Vector3(),
            currentLook: new THREE.Vector3()
        };

        apply(peak, setPosition) {
            let layer = this.layer;
            let speed = this.beatKeeper.getSpeed('double');
            let cam = layer.getCamera();

            let dd = layer.cameraDefaultDistance();
            cam.zoom = this.settings.camera_mode_volume;
            if (setPosition !== false) {
                cam.position.set(
                    this.settings.camera_x * dd,
                    this.settings.camera_y * dd,
                    this.settings.camera_z * dd
                );
            }

            if (!this.shape || (!peak && speed.prc === 0) || (peak && this.audioAnalyser.peak && randomBool())) {

                let shape = layer.randomShape();
                if (shape !== this.shape) {
                    this.shape = shape;
                    this._tween = true;
                }
            }

            if (this._tween) {
                this.shape.getWorldPosition(this.targetLook);

                this.quatFrom = new THREE.Quaternion().copy(cam.quaternion);
                cam.lookAt(this.targetLook);
                this.quatTo = new THREE.Quaternion().copy(cam.quaternion);
                cam.quaternion.copy(this.quatFrom);

                let distance = cam.position.distanceTo(this.targetLook);
                let step = this.animation.getFrameDurationPercent(speed.duration, .25);
                let angle = cam.quaternion.angleTo(this.quatTo);
                let m = Math.sqrt(angle + step);

                if (angle < 2 / distance) {
                    this._tween = false;
                    cam.lookAt(this.targetLook);

                } else {
                    cam.quaternion.rotateTowards(this.quatTo, step * m);
                }
            } else if (this.shape) {
                this.shape.getWorldPosition(this.targetLook);
                cam.lookAt(this.targetLook);
            }

            this.shared.shape = this.shape;
            this.shared.targetLook = this.targetLook;
            this.shared.currentLook = this.currentLook;
        }
    }
}
{
    HC.plugins.camera_mode.lookatshapepeak = class Plugin extends HC.CameraModePlugin {
        static name = 'look at a shape on peak';

        apply() {
            this.layer.getCameraModePlugin('lookatshape').apply(true);
        }
    }
}
