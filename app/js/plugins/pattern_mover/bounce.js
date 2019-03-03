{
    HC.plugins.pattern_mover.bounce = class Plugin extends HC.PatternMoverPlugin {
        static name = 'bounce h';
        mover = {
            x: 0,
            y: 0
        };
        injections = {
            panmox: 0,
            panmoy: 0,
            panhox: 0,
            panhoy: 0
        };

        apply(shape, vertical) {
            let layer = this.layer;

            let patternPlugin = layer.getPatternPlugin();
            let shared = patternPlugin.sharedMoverParams();

            let gapx = shared.gap.x;
            let gapy = shared.gap.y;
            let ox = shared.offset.x;
            let oy = shared.offset.y;

            if (this.isFirstShape(shape)) {
                let shapeDir = layer.getShapeDirection(shape);
                let jump = this.settings.pattern_padding * shapeDir;

                let speed = layer.getCurrentSpeed();
                jump *= animation.diffPrc * (layer.shapeSize(1) * shape.size() * speed.prc) / 4;

                if (vertical) {
                    this.mover.y += jump;

                } else {
                    this.mover.x += jump;
                }
            }

            let pos = shape.position().clone();
            pos.sub(layer.patternCenterVector());
            let x = pos.x;
            let y = pos.y;
            let z = pos.z;
            let px = this.mover.x;
            let py = this.mover.y;

            let params = this.params(shape);
            let matrix = layer.getPatternPlugin('matrix');
            let spanx = matrix.columnCount(layer) * gapx;

            if (px + x + params.panmox > ox + spanx) {
                params.panmox -= spanx;
            }
            if (px + x + params.panmox < ox) {
                params.panmox += spanx;
            }

            x += px + params.panmox;

            let spany = matrix.rowCount(layer) * gapy;

            if (py + y + params.panmoy > oy + spany) {
                params.panmoy -= spany;
            }
            if (py + y + params.panmoy < oy) {
                params.panmoy += spany;
            }

            y += py + params.panmoy;

            layer.positionIn3dSpace(shape, x, y, z);
        }
    }
}
{
    HC.plugins.pattern_mover.bouncev = class Plugin extends HC.PatternMoverPlugin {
        static name = 'bounce v';

        apply(shape) {
            let layer = this.layer;
            layer.getPatternMoverPlugin('bounce').apply(shape, true);
        }
    }
}
{
    HC.plugins.pattern_mover.bouncer = class Plugin extends HC.PatternMoverPlugin {
        static name = 'bounce h|v';
        dir = false;

        apply(shape) {
            let layer = this.layer;
            let speed = this.layer.getShapeSpeed(shape);
            if (this.isFirstShape(shape) && speed.prc == 0) {
                this.dir = randomBool();
            }
            if (this.dir) {
                layer.getPatternMoverPlugin('bounce').apply(shape, false);
            } else {
                layer.getPatternMoverPlugin('bounce').apply(shape, true);
            }
        }
    }
}