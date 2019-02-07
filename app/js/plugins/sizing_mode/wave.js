HC.plugins.sizing_mode.wave = _class(
    function () {
        this.angle = 0;
    }, HC.SizingModePlugin, {
        name: 'wave',
        apply: function (shape) {
            var layer = this.layer;
            if (this.isFirstShape(shape)) {
                var dur = beatkeeper.getDefaultSpeed().duration;
                var step = 45 / dur;
                this.angle += animation.diff * step;

                if (this.angle > 360 || isNaN(this.angle)) {
                    this.angle = 0;
                }
            }
            var va = this.angle + 360 / layer.shapeCount() * shape.index;
            va = va > 360 ? va - 360 : va;

            var s = Math.cos(RAD * va);

            s *= this.settings.sizing_scale;
            var x = this.settings.sizing_x * s;
            var y = this.settings.sizing_y * s;
            var z = this.settings.sizing_z * s;

            shape.scale(x, y, z);
        }
    }
);
