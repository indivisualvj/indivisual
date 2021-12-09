/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternMoverPlugin} from "../PatternMoverPlugin";

class torch extends PatternMoverPlugin {
        static name = 'torch';
        mover = {
            x: 0,
            y: 0,
            a: 0
        };
        injections = {
            panmox: 0,
            panmoy: 0,
            panhox: 0,
            panhoy: 0
        };

        apply(shape) {
            let layer = this.layer;

            let patternPlugin = layer.getPatternPlugin();
            let shared = patternPlugin.sharedMoverParams();

            let gapx = shared.gap.x;
            let gapy = shared.gap.y;
            let ox = shared.offset.x;
            let oy = shared.offset.y;

            if (this.isFirstShape(shape)) {
                let jump = 0.1 * this.animation.diff * this.settings.pattern_padding;
                this.mover.a += randomInt(-10, 10);
                let a = 90 + this.mover.a * 0.98;
                let x = Math.sin(a * RAD) * jump;
                let y = Math.cos(a * RAD) * jump;

                this.mover.x += x;
                this.mover.y += y;
            }

            let pos = shape.position().clone();
            pos.sub(layer.getPatternPlugin().patternCenterVector());
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

            layer.getPatternPlugin().positionIn3dSpace(shape, x, y, z);
        }
    }


export {torch};
