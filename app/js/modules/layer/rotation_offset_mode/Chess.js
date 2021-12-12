/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {RotationOffsetModePlugin} from "../RotationOffsetModePlugin";

class chess45 extends RotationOffsetModePlugin {
    static name = 'chess45';

    apply(shape) {
        if (shape.index % 2 === 0) {
            let a = 45;

            let x = a * this.settings.rotation_offsetx;
            let y = a * this.settings.rotation_offsety;
            let z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}


class chess90 extends RotationOffsetModePlugin {
    static name = 'chess90';

    apply(shape) {
        if (shape.index % 2 === 0) {
            let a = 90;

            let x = a * this.settings.rotation_offsetx;
            let y = a * this.settings.rotation_offsety;
            let z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}


class chessrows90 extends RotationOffsetModePlugin {
    static name = 'chessrows90';

    apply(shape) {
        let layer = this.layer;

        let gridPosition = layer.getPatternPlugin('matrix').gridPosition(shape);
        if (gridPosition.y % 2 === 0) {
            let a = 90;

            let x = a * this.settings.rotation_offsetx;
            let y = a * this.settings.rotation_offsety;
            let z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }
    }
}


class chesscolumns90 extends RotationOffsetModePlugin {
    static name = 'chesscolumns90';

    apply(shape) {
        let layer = this.layer;
        let gridPosition = layer.getPatternPlugin('matrix').gridPosition(shape);
        if (gridPosition.x % 2 === 0) {
            let a = 90;

            let x = a * this.settings.rotation_offsetx;
            let y = a * this.settings.rotation_offsety;
            let z = a * this.settings.rotation_offsetz;

            shape.rotationOffset(x, y, z);
        }

    }
}

export {chesscolumns90, chessrows90, chess45, chess90};
