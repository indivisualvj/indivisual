{
    HC.plugins.shape_delay.off = class Plugin extends HC.ShapeDelayPlugin {
        static index = 1;

        apply(shape) {
        }
    }
}
{
    HC.plugins.shape_delay.random = class Plugin extends HC.ShapeDelayPlugin {
        static name = 'random';
        static index = 2;

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            let du = layer.getShapeDuration(shape) * 0.5;
            du = randomInt(0, du);
            params.delay = du;
        }
    }
}
{
    HC.plugins.shape_delay.quarter = class Plugin extends HC.ShapeDelayPlugin {
        static name = '1/4';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            if (shape.index % 2 === 1) {
                params.delay = layer.getShapeDuration(shape) / 4;
            }
        }
    }
}
{
    HC.plugins.shape_delay.half = class Plugin extends HC.ShapeDelayPlugin {
        static name = '1/2';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            if (shape.index % 2 === 1) {
                params.delay = layer.getShapeDuration(shape) / 2;
            }
        }
    }
}
{
    HC.plugins.shape_delay.grow = class Plugin extends HC.ShapeDelayPlugin {
        static name = 'grow';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            let du = layer.getShapeDuration(shape) * 0.5 / layer.shapeCount();
            params.delay = du * shape.index;
        }
    }
}
{
    HC.plugins.shape_delay.shrink = class Plugin extends HC.ShapeDelayPlugin {
        static name = 'shrink';

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            let du = layer.getShapeDuration(shape) * 0.5 / layer.shapeCount();
            params.delay = du * layer.shapeCount() - du * shape.index;
        }
    }
}
{
    HC.plugins.shape_delay.center = class Plugin extends HC.ShapeDelayPlugin {
        static name = 'center';
        static index = 998;

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            let du = layer.getShapeDuration(shape) * 0.5;
            let ox = Math.abs(layer.getPatternPlugin().patternCenterX() - shape.x()) / layer.getPatternPlugin().patternCenterX();
            params.delay = du * ox;
        }
    }
}
{
    HC.plugins.shape_delay.decenter = class Plugin extends HC.ShapeDelayPlugin {
        static name = 'decenter';
        static index = 999;

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            let du = layer.getShapeDuration(shape) * 0.5;
            let plug = this.layer.getPatternPlugin();
            let ox = Math.abs(plug.patternCenterX() - shape.x()) / plug.patternCenterX();
            params.delay = du - du * ox;
        }
    }
}
{
    HC.plugins.shape_delay.chess = class Plugin extends HC.ShapeDelayPlugin {
        static name = 'chess';
        switcher = 0;

        before(shape) {
            HC.ShapeDelayPlugin.prototype.before.call(this, shape);
            if (this.isFirstShape(shape)) {
                this.switcher = !this.switcher;
                return false;
            }
        }

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);
            if (this.switcher) {
                if (shape.index % 2 === 1) {
                    let rp = layer.getShapeSpeed(shape);
                    params.delay = rp.duration;
                    rp.duration = 0;
                }
            } else {
                if (shape.index % 2 === 0) {
                    let rp = layer.getShapeSpeed(shape);
                    params.delay = rp.duration;
                    rp.duration = 0;
                }
            }
        }

        after(shape) {
            // overwrite super function to disable duration/delay corrections
        }
    }
}