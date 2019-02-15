HC.plugins.camera_mode.lookatshape = _class(
    function () {
        this.targetLook = new THREE.Vector3(0, 0, 0);
        this.currentLook = new THREE.Vector3(0, 0, 0);
        this.shape = false;
        this.entry = 0;
        this._tween = false;
        this.quatFrom = false;
        this.quatTo = false;
        this.shared = {
            shape: false,
            targetLook: new THREE.Vector3(),
            currentLook: new THREE.Vector3()
        };

    }, HC.CameraModePlugin, {
        name: 'look at a shape',
        apply: function (peak, setPosition) {
            var layer = this.layer;
            var speed = beatkeeper.getSpeed('double');
            var cam = layer.getCamera();

            var dd = layer.cameraDefaultDistance();
            cam.zoom = this.settings.camera_mode_volume;
            if (setPosition !== false) {
                cam.position.set(
                    this.settings.camera_x * dd,
                    this.settings.camera_y * dd,
                    this.settings.camera_z * dd
                );
            }

            if (!this.shape || (!peak && speed.prc == 0) || (peak && audio.peak && randomBool())) {

                var shape = layer.getRandomShape();
                if (shape != this.shape) {
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

                var distance = cam.position.distanceTo(this.targetLook);
                var step = animation.getFrameDurationPercent(speed.duration, .25);
                var angle = cam.quaternion.angleTo(this.quatTo);
                var m = Math.sqrt(angle + step);

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
);

HC.plugins.camera_mode.lookatshapepeak = _class(false, HC.CameraModePlugin, {
    name: 'look at a shape on peak',
    apply: function () {
        this.layer.getCameraModePlugin('lookatshape').apply(true);
    }
});
