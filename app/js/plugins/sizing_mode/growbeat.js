HC.plugins.sizing_mode.growbeat = _class(false, HC.SizingModePlugin, {

    injections: {active: false, since: 0},

    apply: function (shape) {
        var layer = this.layer;
        var speed = layer.getShapeSpeed(shape);

        var params = this.params(shape);
        var s = 0.01;
        // do not grow
        if (params.active < 0.1) {

            // when to start growing?
            if ((audio.peak && randomInt(0, this.settings.sizing_mode_sync ? 2 : 6) === 0)
                || (audio.volume > 0.05 && speed.progress <= 0 && randomInt(0, this.settings.sizing_mode_sync ? 2 : layer.shapeCount()) === 0)
            ) {
                params.active = this.settings.sizing_mode_limit ? 0.09 : 0.11;
                params.since = animation.now;
            }

            var mul = this.settings.sizing_scale;

            if (this.settings.sizing_mode_audio == true) {
                mul *= (this.settings.sizing_mode_sync == false ? shape.shapeVolume() : audio.volume * 2);
            }

            if (this.settings.sizing_mode_limit == true) {
                mul = Math.min(1, Math.max(-1, mul));
            }

            var d = params.active ? params.active : (params.active = 0.09);

            d *= mul;
            s = (Math.abs(d) < 0.001 ? 0.001 : d);

            // grow
        } else {

            var speed = layer.getShapeSpeed(shape);
            var jump = 1 / speed.duration * animation.diffPrc;

            params.active += jump * 60 * this.settings.sizing_scale;

            var diff = animation.now - params.since;
            if (diff > speed.duration * 4 / this.settings.sizing_scale) {
                params.active = 0.09;
            }

            var d = params.active ? params.active : (params.active = 0.09);

            s = (Math.abs(d) < 0.001 ? 0.001 : d);
        }

        var x = this.settings.sizing_x * s;
        var y = this.settings.sizing_y * s;
        var z = this.settings.sizing_z * s;

        shape.scale(x, y, z);
    }
});
