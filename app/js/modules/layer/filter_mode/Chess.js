/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {FilterModePlugin} from "../FilterModePlugin";

class chess2 extends FilterModePlugin {
    static name = 'chess²';
    invert = false;

    apply(shape, plugin) {
        let layer = this.layer;

        if (this.isFirstShape(shape)) {
            if (this.animation.audioManager.isActive() && this.audioAnalyser.peak) {
                this.invert = !this.invert;
            }
        }

        layer.getFilterModePlugin(plugin || 'pulse').apply(shape);

        let color = shape.color;

        if (this.invert) {
            if (shape.index % 2 === 1) {
                let pi = shape.index - 1;
                if (pi >= 0 && pi < layer.shapes.length) {
                    let src = layer.getShape(pi).color;
                    this.chess(src, color);
                }
            }

        } else {
            if (shape.index % 2 === 0) {
                let ni = shape.index + 1;
                if (ni >= 0 && ni < layer.shapes.length) {
                    let src = layer.getShape(ni).color;
                    this.chess(src, color);
                }
            }
        }
    }

    chess(src, target) {
        target.h = src.h + 180;
        if (target.h > 360) {
            target.h -= 360;
        }

        target.s = src.s + 50;
        target.l = src.l + 40;
        if (target.s > 100) {
            target.s -= 100;
        }
        if (target.l > 80) {
            target.l -= 80;
        }
    }
}


class chess2flash extends FilterModePlugin {
    static name = 'chess²flash';

    apply(shape) {
        let layer = this.layer;
        layer.getFilterModePlugin('chess2').apply(shape, 'flash');
    }
}


class chess2strobe extends FilterModePlugin {
    static name = 'chess²strobe';

    apply(shape) {
        let layer = this.layer;
        layer.getFilterModePlugin('chess2').apply(shape, 'strobe');
    }
}

export {chess2, chess2flash, chess2strobe};
