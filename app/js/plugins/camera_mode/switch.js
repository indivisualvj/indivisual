HC.plugins.camera_mode.switch = _class(false, HC.CameraModePlugin, {
    name: 'switch position (current)',
    before() {
        this.layer.updateCameraFov();
    },

    apply(peak) {
        var speed = this.layer.getCurrentSpeed();
        var cam = this.layer.getCamera();

        cam.zoom = this.settings.camera_mode_volume;

        if ((!peak && speed.prc == 0) || (peak && audio.peak && randomBool())) {
            var pos = cam.position;

            pos.copy(this.layer.random3dPosition());
            cam.lookAt(new THREE.Vector3(0, 0, 0));

            return true;
        }
    }
});

HC.plugins.camera_mode.switchpeak = _class(false, HC.CameraModePlugin, {
    name: 'switch position (peak)',
    before() {
        this.layer.getCameraModePlugin('switch').before();
    },
    apply() {
        this.layer.getCameraModePlugin('switch').apply(true);
    }
});

HC.plugins.camera_mode.switchlookat = _class(
    function () {
        this.shape = false;
        this.lookAtVector = false;
    }, HC.CameraModePlugin, {
        name: 'switch position lookat shape (current)',
        before() {
            this.layer.getCameraModePlugin('switch').before();
        },
        apply(peak) {

            var change = this.layer.getCameraModePlugin('switch').apply(peak);

            if (change) {
                var shape = this.layer.getRandomShape();
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
);


HC.plugins.camera_mode.switchlookatpeak = _class(
    function () {
        this.shape = false;
        this.lookAtVector = false;
    }, HC.CameraModePlugin, {
        name: 'switch position lookat shape (peak)',
        before() {
            this.layer.getCameraModePlugin('switch').before();
        },
        apply() {
            this.layer.getCameraModePlugin('switchlookat').apply(true);
        }
    }
);