{
    HC.plugins.offset_mode.torch = class Plugin extends HC.OffsetModePlugin {
        static name = 'torch';
        mover;
        velocity = new THREE.Vector2(randomInt(10, 20, true), randomInt(10, 20, true));
        helper;

        apply(shape) {
            let layer = this.layer;
            let pos = this.mover;

            if (this.isFirstShape(shape)) {
                if (!this.mover) {
                    this.mover = layer.patternCenterVector(true);
                    pos = this.mover;
                }

                let bounds = layer.resolution().clone();
                bounds.y *= -1;
                if (pos.x >= bounds.x) {
                    this.velocity.x = -randomInt(10, 15);
                    pos.x = bounds.x;

                } else if (pos.x <= 0) {
                    this.velocity.x = randomInt(10, 15);
                    pos.x = 0;
                }
                if (pos.y <= bounds.y) {
                    this.velocity.y = randomInt(10, 15);
                    pos.y = bounds.y;

                } else if (pos.y >= 0) {
                    this.velocity.y = -randomInt(10, 15);
                    pos.y = 0;
                }

                let m = this.layer.settings.pattern_padding;
                pos.x += this.velocity.x * this.animation.diffPrc * m;
                pos.y += this.velocity.y * this.animation.diffPrc * m;
            }
            let a = shape.position().distanceTo(pos);
            let m = a * layer.shapeSize(.01);
            let x = this.settings.offset_x * m;
            let y = this.settings.offset_y * m;
            let z = this.settings.offset_z * m;

            shape.offset(x, y, z);

        }
    }
}