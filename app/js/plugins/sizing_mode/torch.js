{
    HC.plugins.sizing_mode.torch = class Plugin extends HC.SizingModePlugin {
        mover = {
            a: 120,
            x: 0,
            y: 0,
            z: 0
        };

        apply(shape) {
            let layer = this.layer;

            if (this.isFirstShape(shape)) {
                let jump = 0.4 * this.animation.diff;
                if (audio.peak) {
                    jump *= 4;
                }
                this.mover.a += randomInt(-10, 10);

                let a = this.mover.a;
                let x = Math.sin(a * RAD) * jump;
                let y = Math.cos(a * RAD) * jump;

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

            let size = layer.getSizingModePlugin('sphere').calculate(shape, false, this.mover);
            shape.scale(size.x, size.y, size.z);
        }
    }
}
