HC.plugins.camera_mode.flytoshape = _class(false, HC.CameraModePlugin, {
    name: 'fly to shape',
    before: function () {
        // dispable parent.before
        this.layer.updateCameraFov();
    },
    apply: function (peak) {
        var layer = this.layer;

        var lookatshape = layer.getCameraModePlugin('lookatshape');
        lookatshape.apply(peak);

        var cam = layer.getCamera();
        var shared = lookatshape.shared;

        var pos = cam.position;
        var distance = pos.distanceTo(shared.targetLook);

        if (distance > layer.shapeSize(shared.shape.size()) * 3) {
            var speed = beatkeeper.getSpeed('full');
            var prog = animation.getFrameDurationPercent(speed.duration, .75);

            cam.translateZ(-prog * distance / 2);
        }
    }
});

HC.plugins.camera_mode.flytoshapepeak = _class(false, HC.CameraModePlugin, {
    name: 'fly to shape on peak',
    apply: function () {
        var layer = this.layer;

        layer.getCameraModePlugin('flytoshape').apply(true);
    }
});