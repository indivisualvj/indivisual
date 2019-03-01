HC.plugins.camera_mode.mirror = _class(
    function () {
        this.mirror = new THREE.Vector3(1, 1, 1);
    }, HC.CameraModePlugin, {
        name: 'mirror XYZ position (current)',
        apply(peak) {

            var speed = this.layer.getCurrentSpeed();
            if ((peak && audio.peak && randomBool()) || (!peak && speed.prc == 0)) {
                this.mirror.x = randomBool() ? -1 : 1;
                this.mirror.y = randomBool() ? -1 : 1;
                this.mirror.z = randomBool() ? -1 : 1;
            }

            this.layer.getCameraModePlugin('manual').apply();
            var cam = this.layer.getCamera();
            cam.position.x *= this.mirror.x;
            cam.position.y *= this.mirror.y;
            cam.position.z *= this.mirror.z;

            cam.lookAt(new THREE.Vector3(0, 0, 0));
        }
    }
);

HC.plugins.camera_mode.mirrorpeak = _class(false, HC.CameraModePlugin, {
    name: 'mirror XYZ position (peak)',
    apply() {
        this.layer.getCameraModePlugin('mirror').apply(true);
    }
});