/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {PatternMoverPlugin} from "../PatternMoverPlugin";

class pan extends PatternMoverPlugin {
    static name = 'pan h';
    injections = {
        panmox: 0,
        panmoy: 0,
        panhox: 0,
        panhoy: 0
    };

    mover = {
        x: 0,
        y: 0
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

            jump *= (0.1 * this.animation.diff);

            if (vertical) {
                this.mover.y += jump;

            } else {
                this.mover.x += jump;
            }
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

        this.layer.getPatternPlugin().positionIn3dSpace(shape, x, y, z);

    }
}


class panv extends PatternMoverPlugin {
    static name = 'pan v';

    apply(shape) {
        let layer = this.layer;
        layer.getPatternMoverPlugin('pan').apply(shape, true);
    }
}


class panr extends PatternMoverPlugin {
    static name = 'pan h|v';
    dir = false;

    apply(shape) {
        let layer = this.layer;
        let speed = this.layer.shapeSpeed(shape);
        if (this.isFirstShape(shape) && speed.prc === 0) {
            this.dir = randomBool();
        }
        if (this.dir) {
            layer.getPatternMoverPlugin('pan').apply(shape, false);
        } else {
            layer.getPatternMoverPlugin('pan').apply(shape, true);
        }
    }
}

export {pan, panv, panr};
