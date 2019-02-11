HC.plugins.sizing_mode.torch = _class(
    function () {
        this.mover = {
            a: 120,
            x: 0,
            y: 0,
            z: 0
        };
    }, HC.SizingModePlugin, {
        apply: function (shape) {
            var layer = this.layer;

            if (this.isFirstShape(shape)) {
                var jump = 0.4 * animation.diff;
                if (audio.peak) {
                    jump *= 4;
                }
                this.mover.a += randomInt(-10, 10);

                var a = this.mover.a;
                var x = Math.sin(a * RAD) * jump;
                var y = Math.cos(a * RAD) * jump;

                if ((this.mover.x < 0 && x < 0) || (this.mover.x > layer.resolution().x && x > 0)) {
                    x *= -1;
                    // console.log('x', this.mover.x, x);
                }

                if ((this.mover.y < 0 && y < 0) || (this.mover.y > layer.resolution().y && y > 0)) {
                    y *= -1;
                    // console.log('y', this.mover.y, y);
                }

                this.mover.x += x;
                this.mover.y += y;
            }

            var size = layer.getSizingModePlugin('sphere').calculate(shape, false, this.mover);
            shape.scale(size.x, size.y, size.z);
        }
    }
);
